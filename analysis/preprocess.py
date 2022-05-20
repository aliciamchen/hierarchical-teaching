import glob
import json
import os

import numpy as np
import pandas as pd

in_dir = "../data/raw/2022-05-19_pilot_responsesOnly"
out_dir = "../data/2022-05-19_pilot"

filenames = sorted(glob.glob(in_dir + "/*.json"))

dfs_demographics = []
dfs_data = []

# Loop over individual participant files
for filename in filenames:

    with open(filename) as f:
        raw_json_data = json.load(f)

    demographics = raw_json_data[-1]
    data = raw_json_data[:-1]

    # Make survey/demographics dataframe
    df_demographics = df_demographics = pd.DataFrame(data={
        'subject_id': demographics['subjectId'],
        'time_elapsed': demographics['time_elapsed'],
        'gender': demographics['response']['gender'],
        'age': int(demographics['response']['age']),
        'understood': demographics['response']['understood'],
        'comments': demographics['response']['comments']
    }, index=[0])

    # Make data dataframe
    cols = ['subject_id', 'student_idx', 'block_type', 'trial_num', 'true_theta',
            'student_a', 'student_b', 'student_class', 'heads', 'tails', 'student_guess']
    df_data = pd.DataFrame(columns=cols)
    for i, trial in enumerate(data):
        df_data.loc[i, 'subject_id'] = trial['subjectId']
        df_data.loc[i, 'student_idx'] = trial['studentIndex']
        df_data.loc[i, 'block_type'] = trial['condition']
        df_data.loc[i, 'true_theta'] = trial['trueTheta']
        df_data.loc[i, 'trial_num'] = 0 if trial['exampleSet'] == 'first' else 1
        df_data.loc[i, 'student_a'] = trial['studentTrueHypers']['a']
        df_data.loc[i, 'student_b'] = trial['studentTrueHypers']['b']
        df_data.loc[i, 'student_class'] = trial['studentTrueClassroom']
        df_data.loc[i, 'student_guess'] = trial['studentGuess']
        df_data.loc[i, 'delta'] = trial['delta']

        if trial['exampleSet'] == 'second':
            df_data.loc[i, 'heads'] = trial['secondResponseHeads']
            # ugh is is cluncky, should have saved it differently
            df_data.loc[i, 'tails'] = trial['secondResponseTails']
        else:
            df_data.loc[i, 'heads'] = trial['heads']
            df_data.loc[i, 'tails'] = trial['tails']

    # get rid of student guess in sequential no feedback case
    df_data.loc[(df_data['block_type'] == "seqNoFeedback") & (
        df_data['trial_num'] == 0), ['student_guess', 'delta']] = np.nan

    # get rid of delta in sequential feedback case (cause first guess doesn't matter)
    df_data.loc[(df_data['block_type'] == "seqFeedback") & (
        df_data['trial_num'] == 0), ['delta']] = np.nan

    dfs_demographics.append(df_demographics)
    dfs_data.append(df_data)

df_demographics_all = pd.concat(dfs_demographics, ignore_index=True)
df_data_all = pd.concat(dfs_data, ignore_index=True)

df_demographics_all.to_csv(os.path.join(out_dir, "demographics_pilot1.csv"))
df_data_all.to_csv(os.path.join(out_dir, "data_pilot1.csv"))
