import csv

with open("grid.csv", "w") as csv_file:
    writer = csv.writer(csv_file, delimiter=",")
    for speakerAlpha in [1, 2, 4, 8, 16]:
        for listenerAlpha in [1, 2, 4, 8, 16]:
            for costWeight in [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]:
                    writer.writerow(
                        [
                            speakerAlpha,
                            listenerAlpha,
                            round(costWeight, 2),
                        ]
                    )