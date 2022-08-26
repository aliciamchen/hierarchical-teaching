import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('../../data/learner/pilot_2a/pilot_2a_data.csv')

# filters for all attention passed + only first trials
df = df[df['n_attention_passed'] == 2]
df = df[df['trial_num'] == 0]

# makes feedback choice either 0 or 1 and teacher knowledge between 0 and 1
df.loc[df['feedback_choice'] == 'yes', 'feedback_choice'] = 1
df.loc[df['feedback_choice'] == 'no', 'feedback_choice'] = 0
df['teacher_knowledge'] = df['teacher_knowledge'] / 100.

# filter for students with 1:9 priors
oneNine = df[df['student_a'] == 1]
fig1 = sns.relplot(x="first_examples_a", y="teacher_knowledge", data=oneNine, kind='line', 
			linestyle='', marker='o', err_style='bars')\
	.set(title='1:9 prior, teacher knowledge')
fig2 = sns.relplot(x="first_examples_a", y="feedback_choice", data=oneNine, kind='line', 
			linestyle='', marker='o', err_style='bars')\
	.set(title='1:9 prior, feedback provided?')
fig1.set(ylim=(0, 1))
fig2.set(ylim=(0, 1))
plt.show()

# filters for students with 9:1 priors
nineOne = df[df['student_a'] == 9]
fig1 = sns.relplot(x="first_examples_a", y="teacher_knowledge", data=nineOne, kind='line', 
			linestyle='', marker='o', err_style='bars')\
	.set(title='9:1 prior, teacher knowledge')
fig2 = sns.relplot(x="first_examples_a", y="feedback_choice", data=nineOne, kind='line', 
			linestyle='', marker='o', err_style='bars')\
	.set(title='9:1 prior, feedback provided?')
fig1.set(ylim=(0, 1))
fig2.set(ylim=(0, 1))


# collapses along priors (effectively makes all priors 9:1)
df[['student_a', 'student_b', 'first_examples_a', 'first_examples_b']] \
	= df[['student_a', 'student_b', 'first_examples_a', 'first_examples_b']].\
	where(df['student_a'] == 9, \
	df[['student_b', 'student_a', 'first_examples_b', 'first_examples_a']].values)

fig1 = sns.relplot(x="first_examples_a", y="teacher_knowledge", data=df, kind='line', 
			linestyle='', marker='o', err_style='bars')\
	.set(title='teacher knowledge, 9:1 (collapsed)')
fig1.set(ylim=(0, 1))
fig2 = sns.relplot(x="first_examples_a", y="feedback_choice", data=df, kind='line', 
			linestyle='', marker='o', err_style='bars')\
	.set(title='feedback provided? 9:1 (collapsed)')
fig2.set(ylim=(0, 1))