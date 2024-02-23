#!/bin/bash
# Generate the current date and time in a format like "YYYYMMDD_HHMMSS"
current_datetime=$(date +"%Y%m%d_%H%M%S")

# Create a directory with the current date and time as its name
mkdir -p ~/data/"$current_datetime"

while true; do
    # Use rsync to copy the tajriba.json file into the newly created folder
    rsync -avh --progress root@159.89.41.83:~/.empirica/local/tajriba.json data/"$current_datetime"/

    # Sleep for 5 minutes (300 seconds)
    sleep 300
done
