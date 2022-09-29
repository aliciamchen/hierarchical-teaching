#!/bin/bash#
parallel --bar --colsep ',' "sh ./simulation.sh {1} {2} {3}" :::: input/grid.csv
