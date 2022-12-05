#!/bin/bash#
export NODE_OPTIONS=--max_old_space_size=30000
parallel --bar --colsep ',' "sh ./simulation.sh {1} {2}" :::: input/grid.csv

# combine into one big csv
head -n 1 output/indiv/sa1_cw0.01.csv > output/combined.out && tail -n+2 -q output/indiv/*.csv >> output/combined.out
mv output/combined.out output/combined.csv