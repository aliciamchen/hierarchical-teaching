#!/bin/bash

R_SCRIPTS_DIR="analysis"

OUTPUT_DIR="analysis/outputs"

for R_SCRIPT in "$R_SCRIPTS_DIR"/*.R; do
    SCRIPT_NAME=$(basename "$R_SCRIPT" .R)

    OUTPUT_FILE="$OUTPUT_DIR/$SCRIPT_NAME.txt"

    Rscript "$R_SCRIPT" > "$OUTPUT_FILE"

    # Optional: check if R script ran successfully
    if [ $? -eq 0 ]; then
        echo "Successfully processed $R_SCRIPT"
    else
        echo "Failed to process $R_SCRIPT"
    fi
done

echo "All scripts processed"