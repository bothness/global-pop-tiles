# Global population data tiles
This repository contains vector map tiles based on the 30 arc-second resolution Gridded Population of the World (GPW) v4.11 datasets from the NASA Socioeconomic Data and Applications Center (SEDAC).

Having this data in vector tiles allows for browser-based applications that can present demographic data for custom areas on a map, without any need for back-end infrastructure. An experimental proof-of-concept application can be found here.

Note that the values in the vector tiles are multiplied by 1000 and rounded to the nearest whole number. This gives a precision of 0.001 people per grid cell, but reduces filesize by storing the numbers as integers instead of floats.

The datasets include:
- [UN WPP-Adjusted Population Count](https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-count-adjusted-to-2015-unwpp-country-totals-rev11) for 2000, 2005, 2010, 2015 and 2020.
- [Basic Demographic Characteristics](https://sedac.ciesin.columbia.edu/data/set/gpw-v4-basic-demographic-characteristics-rev11) for 2010 (including 5 year age bands and sex).

If you'd like to build the tiles yourselves, you'll need to have Git, NodeJS and Tippecanoe installed (on a Mac or Linux system), and to run the following commands:

Clone the repo:
```bash
git clone https://github.com/bothness/global-pop-data.git
```

Install the Node dependencies:
```bash
npm install
```

Run the build scripts:
```bash
npm run build
```