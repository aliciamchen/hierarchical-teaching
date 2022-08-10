import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('../../data/learner/pilot_1a/pilot_1a_data.csv')

# nineOne = df[df['student_a'] == 9]
# fig1 = sns.lineplot(x="first_examples_a", y="teacher_knowledge", data=nineOne)

oneNine = df[df['student_a'] == 1]
fig, ax = plt.subplots(figsize=(4,5))
sns.relplot(x="first_examples_a", y="teacher_knowledge", data=oneNine, kind='scatter')