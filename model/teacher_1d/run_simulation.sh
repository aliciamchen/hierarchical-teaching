#!/bin/bash#
parallel --bar --colsep ',' "sh ./simulation.sh {1} {2}" :::: input/grid.csv

# combine into one big csv
head -n 1 output/indiv/sa1_cw0.csv > output/combined.out && tail -n+2 -q output/indiv/*.csv >> output/combined.out
mv output/combined.out output/combined.csv