import os
import json

hard_problem_indices = [
  2, 4, 7, 8, 9, 13, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 31, 32,
  33, 36, 39,
]

print(os.getcwd())
def flatten_problems(problems):
    flattened_problems = []
    for problem in problems:
        flattened_problem = {}
        for letter, matrix in problem.items():
            flattened_matrix = [value for row in matrix for value in row]
            flattened_problem[letter] = flattened_matrix
        flattened_problems.append(flattened_problem)
    return flattened_problems




# Path to the JSON file containing all_problems
input_file_path = 'all_problems.json'
# output_file_path = 'flattened_problems.json'

# Read the JSON data from the file
with open(input_file_path, 'r') as json_file:
    all_problems = json.load(json_file)

# Flatten the problems
flattened_problems = flatten_problems(all_problems)

# TODO: save 'flattened_hardest_problems' to a new JSON file
# filter only the hardest problems
flattened_hardest_problems = [flattened_problems[i] for i in hard_problem_indices]

# Save the flattened problems as a new JSON file
with open('flattened_problems.json', 'w') as json_file:
    json.dump(flattened_problems, json_file, indent=4)

with open('flattened_hardest_problems.json', 'w') as json_file:
    json.dump(flattened_hardest_problems, json_file, indent=4)
# print(f"Flattened problems have been saved to {output_file_path}")
