# Preprocess raw `.json` data from experiment
# python preprocess.py --in_dir pilot_1a_data --out_dir pilot_1a --expt_label pilot_1a

import glob
import json
import os
import argparse

import numpy as np
import pandas as pd


if __name__ == "__main__":

    in_base_dir = "../../data/learner/raw"
    out_base_dir = "../../data/learner"

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--in_dir",
        required=True,
        help="raw data directory in ../../data/learner/raw"
    )

    parser.add_argument(
        "--out_dir",
        required=True,
        help="output directory in ../../data/learner"
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

    # Clean data, make csv files

    filenames = sorted(glob.glob(in_dir + "/*responsesOnly.json"))

    dfs_demographics = []
    dfs_data = []
    dfs_bonuses = []

    for filename in filenames:

        with open(filename) as f:
            raw_json_data = json.load(f)

        demographics = raw_json_data[-1]
        data = raw_json_data[:-1]
        # print(demographics)
        # Make survey/demographics dataframe
        # print(demographics)
        df_demographics = pd.DataFrame(data={
            'subject_id': demographics['subjectId'],
            'time_elapsed': demographics['time_elapsed'],
            'gender': demographics['response']['gender'],
            'age': int(demographics['response']['age']),
            'understood': demographics['response']['understood'],
            'total_bonus': demographics['totalBonus'],
            'comments': demographics['response']['comments'],
            'strategy': demographics['response']['strategy'],
            'n_attention_passed': demographics['nAttentionPassed']
        }, index=[0])

        # Make data dataframe
        cols = ['subject_id', 'island_idx', 'block_type', 'trial_num', 'theta',
                'student_a', 'student_b', 'first_examples_a', 'first_examples_b', 
                'first_guess', 'teacher_knowledge', 'feedback_choice', 'bonus',
                'second_examples_a', 'second_examples_b', 'final_guess']
        df_data = pd.DataFrame(columns=cols)

        for i, trial in enumerate(data):
            df_data.loc[i, 'subject_id'] = trial['subjectId']
            df_data.loc[i, 'island_idx'] = trial['studentIndex']
            df_data.loc[i, 'block_type'] = trial['condition']
            df_data.loc[i, 'theta'] = trial['trueTheta']
            df_data.loc[i, 'trial_num'] = 0 if trial['responseSet'] == 'first' else 1
            df_data.loc[i, 'student_a'] = trial['studentTrueHypers']['a']
            df_data.loc[i, 'student_b'] = trial['studentTrueHypers']['b']

            if trial['responseSet'] == 'first':
                df_data.loc[i, 'first_examples_a'] = trial['firstExamples']['a']
                df_data.loc[i, 'first_examples_b'] = trial['firstExamples']['b']
                df_data.loc[i, 'first_guess'] = trial['firstGuess']
                df_data.loc[i, 'teacher_knowledge'] = trial['teacherKnowledge']
                df_data.loc[i, 'feedback_choice'] = trial['feedbackChoice']

            if trial['responseSet'] == 'final':
                df_data.loc[i, 'second_examples_a'] = trial['secondExamples']['a']
                df_data.loc[i, 'second_examples_b'] = trial['secondExamples']['b']
                df_data.loc[i, 'final_guess'] = trial['finalGuess']

        # Add bonus info and understood instructions (for exclusion criteria)
        df_data['total_bonus'] = demographics['totalBonus']
        df_data['understood'] = demographics['response']['understood']
        df_data['n_attention_passed'] = demographics['nAttentionPassed']

        # Make separate csv of bonuses, to upload to cloudResearch
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

    df_demographics_all.to_csv(os.path.join(
        out_dir, f"{expt_label}_demographics.csv"))
    df_data_all.to_csv(os.path.join(out_dir, f"{expt_label}_data.csv"))
    df_bonuses_all.to_csv(os.path.join(
        out_dir, f"{expt_label}_bonuses.csv"), header=None, index=False)
