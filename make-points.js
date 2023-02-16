const fs = require("fs");
const LineByLineReader = require('line-by-line');
const StreamZip = require('node-stream-zip');

const outputFile = "./output/points.json";
const count = 8; // Number of .asc files in each ZIP

const roundCoord = (val) => Math.round(val * 1e6) / 1e6;
const roundVal = (val) => val <= 0 ? 0 : Math.round(val * 1e3);

// List of dataset keys based on the ZIP files in /input folder
let keys = [];
fs.readdirSync("./input").forEach(file => {
  if (file.slice(-3) === "zip") keys.push(file.split(".")[0]);
});

// Start writing to output file
fs.writeFileSync(outputFile, "");
let fcount = 0;

// Read files from each ZIP in parallel
for (let i = 0; i < count; i ++) {
  let lineNum = {};
  let rls = {};
  let thisLine = {};
  let nrows, xllcorner, yllcorner, cellsize;
  keys.forEach(key => lineNum[key] = -1);
  keys.forEach(key => {
    // Open ZIP file
    const zip = new StreamZip({
      file: `./input/${key}.zip`,
      storeEntries: true
    });
    
    zip.on('ready', async () => {
      // Find the .asc files in the ZIP
      let fileList = Object.values(zip.entries())
        .map(f => f.name)
        .filter(f => f.slice(-4) === ".asc" && !f.startsWith("__MACOSX"))
        .sort((a, b) => a.localeCompare(b)); // Sort the list
  
      // Stream a file from the ZIP line-by-line
      zip.stream(fileList[i], (err, stm) => {
        var rl = new LineByLineReader(stm);
        rls[key] = rl;
        rl.on('line', (line) => {
          lineNum[key] ++;
          if (lineNum[key] < 6) {
            if (key === "p20") {
              // Get the metadata from the top of one of the files
              if (lineNum[key] === 1) nrows = +line.slice(14);
              else if (lineNum[key] === 2) xllcorner = +line.slice(14);
              else if (lineNum[key] === 3) yllcorner = +line.slice(14);
              else if (lineNum[key] === 4) cellsize = +line.slice(14);
            }
          } else {
            thisLine[key] = line.split(" ");
          }
          // Pause reading until all parallel files have reached the same line
          rl.pause();
          if ((new Set(keys.map(key => lineNum[key]))).size === 1) {
            if (lineNum[key] >= 6 && thisLine["p20"][1]) {
              let y = nrows + 5 - lineNum[key];
              // Cycle through the columns in the line
              thisLine["p20"].forEach((val, x) => {
                if (roundVal(+val, 3) > 0) {
                  let coordinates = [
                    roundCoord(xllcorner + ((x + 0.5) * cellsize)),
                    roundCoord(yllcorner + ((y + 0.5) * cellsize))
                  ];
                  if (Math.abs(coordinates[1]) <= 85.0511) {
                    // Read the values from all parallel files
                    let properties = {};
                    keys.forEach(key => {
                      properties[key] = roundVal(+thisLine[key][x], 3);
                    });
                    // Generate a GeoJSON feature and write it to JSON-LD file
                    let feature = {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates
                      },
                      properties
                    };
                    fs.appendFileSync(outputFile, `${JSON.stringify(feature)}\n`);
                    fcount += 1;
                  }
                };
              });
              if (y % 100 === 0) console.log(`File ${i + 1} of ${count}. ${nrows - y} of ${nrows} lines read. ${fcount} features written...`);
            }
            // Move to the next line of the file
            keys.forEach(key => rls[key].resume());
          }
        });
        rl.on('end', () => {
          zip.close();
        });
      });
    });
  });
}