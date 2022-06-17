# python preprocess.py --in_dir 2022-06-16_pilot_responsesOnly --out_dir 2022-06-16_pilot --expt_label pilot6
import glob
import json
import os
import argparse

import numpy as np
import pandas as pd



if __name__ == "__main__":

    in_base_dir = "../../data/teacher/raw"
    out_base_dir = "../../data/teacher"

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--in_dir",
        required=True,
        help="raw data directory in ../../data/teacher/raw"
    )

    parser.add_argument(
        "--out_dir",
        required=True,
        help="output directory in ../../data/teacher"
    )

    parser.add_argument(
        "--expt_label",
        required=True
    )

    args = parser.parse_args()

    in_dir = os.path.join(in_base_dir, str(args.in_dir))
    out_dir = os.path.join(out_base_dir, str(args.out_dir))
    expt_label = str(args.expt_label)

    if not os.path.exists(out_dir):
        os.mkdir(out_dir)


    ## Clean data, make csv files

    filenames = sorted(glob.glob(in_dir + "/*.json"))

    dfs_demographics = []
    dfs_data = []
    dfs_bonuses = []

    for filename in filenames:

        with open(filename) as f:
            raw_json_data = json.load(f)

        demographics = raw_json_data[-1]
        data = raw_json_data[:-1]

        # Make survey/demographics dataframe
        df_demographics = pd.DataFrame(data={
            'subject_id': demographics['subjectId'],
            'time_elapsed': demographics['time_elapsed'],
            'gender': demographics['response']['gender'],
            'age': int(demographics['response']['age']),
            'understood': demographics['response']['understood'],
            'total_bonus': demographics['totalBonus'],
            'comments': demographics['response']['comments'],
            'strategy': demographics['response']['strategy']
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
            df_data.loc[i, 'error'] = trial['delta']

            try:
                df_data.loc[i, 'bonus'] = trial['bonus']
            except:
                df_data.loc[i, 'bonus'] = np.nan

            if trial['exampleSet'] == 'second':
                df_data.loc[i, 'heads'] = trial['secondResponseHeads']
                # ugh is is cluncky, should have saved it differently
                df_data.loc[i, 'tails'] = trial['secondResponseTails']
            else:
                df_data.loc[i, 'heads'] = trial['heads']
                df_data.loc[i, 'tails'] = trial['tails']

        # get rid of student guess in sequential no feedback case
        df_data.loc[(df_data['block_type'] == "seqNoFeedback") & (
            df_data['trial_num'] == 0), ['student_guess', 'error']] = np.nan

        # get rid of delta in sequential feedback case (cause first guess doesn't matter)
        df_data.loc[(df_data['block_type'] == "seqFeedback") & (
            df_data['trial_num'] == 0), ['error']] = np.nan

        # Add bonus info and understood instructions (for exclusion criteria)
        df_data['total_bonus'] = demographics['totalBonus']
        df_data['understood'] = demographics['response']['understood']

        # Drop trials with no responses, timeout, more than max
        df_data.drop(df_data[(df_data['heads'] == 0) & (df_data['tails'] == 0)].index, inplace = True)
        df_data.drop(df_data[df_data['heads'] + df_data['tails'] > 70].index, inplace = True)

        # TODO: check that it is dropping the right stuff — there shouldn't be more than 2 observations per thing

        df_data['total_ex'] = df_data['heads'] + df_data['tails']
        df_data['mean'] = df_data['heads'] / (df_data['total_ex'])
        df_data.rename(columns={"true_theta": "theta"}, inplace=True)


        # Make separate csv of bonuses, to upload to cloudREsearch
        df_bonus = pd.DataFrame(data={
            'subject_id': demographics['subjectId'],
            'total_bonus': demographics['totalBonus']
        }, index=[0])

        dfs_demographics.append(df_demographics)
        dfs_data.append(df_data)
        dfs_bonuses.append(df_bonus)

        df_demographics_all = pd.concat(dfs_demographics, ignore_index=True)
        df_data_all = pd.concat(dfs_data, ignore_index=True)
        df_bonuses_all = pd.concat(dfs_bonuses, ignore_index=True)

        # Calculate normalized stuff for df data
        df_data_all.loc[df_data_all['student_class'] == 'B', 'normalized_mean'] = 1 - df_data_all['mean']
        df_data_all.loc[df_data_all['student_class'] == 'B', 'normalized_theta'] = round(1 - df_data_all['theta'].astype(float), 1)
        df_data_all.loc[df_data_all['student_class'] == 'A', 'normalized_mean'] = df_data_all['mean']
        df_data_all.loc[df_data_all['student_class'] == 'A', 'normalized_theta'] = df_data_all['theta']

        ##
        df_demographics_all.to_csv(os.path.join(out_dir, f"demographics_{expt_label}.csv"))
        df_data_all.to_csv(os.path.join(out_dir, f"data_{expt_label}.csv"))
        df_bonuses_all.to_csv(os.path.join(
            out_dir, f"bonuses_{expt_label}.csv"), header=None, index=False)
