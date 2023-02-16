node make-points.js
gzip output/points.json
tippecanoe -o output/tiles_0-8.mbtiles -z8 -r1 --read-parallel --cluster-distance=4 -E a00:sum -E a05:sum -E a10:sum -E a15:sum -E a20:sum -E a25:sum -E a30:sum -E a35:sum -E a40:sum -E a45:sum -E a50:sum -E a55:sum -E a60:sum -E a65:sum -E a70:sum -E a75:sum -E a80:sum -E a85:sum -E f:sum -E m:sum -E p00:sum -E p05:sum -E p10:sum -E p15:sum -E p20:sum --no-feature-limit --no-tile-size-limit output/points.json.gz
tippecanoe -o output/tiles_9.mbtiles -Z9 -z9 -r1 --read-parallel --no-feature-limit --no-tile-size-limit output/points.json.gz
tile-join -e v1 -pk output/tiles_0-8.mbtiles output/tiles_9.mbtiles