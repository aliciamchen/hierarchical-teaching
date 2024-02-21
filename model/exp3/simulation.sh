#!/bin/bash#
export NODE_OPTIONS=--max_old_space_size=30000

node --stack-size=4096 /usr/local/bin/webppl simulation.wppl --require webppl-csv
# webppl simulation.wppl