#!/bin/bash#
export NODE_OPTIONS=--max_old_space_size=100000

mkdir -p output/indiv

node --stack-size=100000 /usr/local/bin/webppl simulation.wppl --require webppl-csv --random-seed 88 -- --speakerAlpha 1 --exampleCost 0.01
node --stack-size=100000 /usr/local/bin/webppl simulation.wppl --require webppl-csv --random-seed 88 -- --speakerAlpha 2 --exampleCost 0.01
node --stack-size=100000 /usr/local/bin/webppl simulation.wppl --require webppl-csv --random-seed 88 -- --speakerAlpha 4 --exampleCost 0.01
node --stack-size=100000 /usr/local/bin/webppl simulation.wppl --require webppl-csv --random-seed 88 -- --speakerAlpha 8 --exampleCost 0.01
node --stack-size=100000 /usr/local/bin/webppl simulation.wppl --require webppl-csv --random-seed 88 -- --speakerAlpha 16 --exampleCost 0.01

# # combine into one big csv
head -n 1 output/indiv/sa1_cw0.01.csv > output/combined.out && tail -n+2 -q output/indiv/*.csv >> output/combined.out
mv output/combined.out output/combined.csv