import csv

with open("grid.csv", "w") as csv_file:
    writer = csv.writer(csv_file, delimiter=",")
    for speakerAlpha in [1, 2, 4, 8, 16]:
            for costWeight in [0, 0.001, 0.005, 0.01, 0.05]:
                    writer.writerow(
                        [
                            speakerAlpha,
                            costWeight
                        ]
                    )