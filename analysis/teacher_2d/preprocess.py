
"""Preprocess raw `.json` data from experiment
"""

# python preprocess.py --in_dir pilot_1 --out_dir teacher_2d/pilot1 --expt_label expt3

import glob
import json
import os
import argparse

import numpy as np
import pandas as pd


if __name__ == "__main__":

    in_base_dir = "../../data/teacher_2d/raw"
    out_base_dir = "../../data"

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--in_dir",
        required=True,
        help="raw data directory in ../../data/teacher_2d/raw"
    )

    parser.add_argument(
        "--out_dir",
        required=True,
        help="output directory in ../../data"
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
    filenames = sorted(glob.glob(in_dir + "/*.json"))
    dfs_demographics = []
    dfs_data = []

    for filename in filenames:

        with open(filename) as f:
            raw_json_data = json.load(f)

        demographics = raw_json_data[-1]
        data = raw_json_data[:-1]
        df_demographics = pd.DataFrame(data={
            'subject_id': demographics['subjectId'],
            'time_elapsed': demographics['time_elapsed'],
            'gender': demographics['response']['gender'],
            'age': int(demographics['response']['age']),
            'understood': demographics['response']['understood'],
            # 'comments': demographics['response']['comments'] if demographics['response']['comments'] else '',
            'strategy': demographics['response']['strategy'],
            'n_attention_passed': demographics['nAttentionChecksPassed']
        }, index=[0])

        try:
            df_demographics['comments'] = demographics['response']['comments']
        except:
            df_demographics['comments'] = ''

        # Make data dataframe
        cols = ['subject_id', 'student_idx', 'block_type', 'trial_num', 'trueStemThresh', 'trueCapThresh', 'trueStemDir', 'trueCapDir', 'prior',
                'stemResponse', 'capResponse', 'feedbackStemThresh', 'feedbackCapThresh', 'feedbackStemDir', 'feedbackCapDir']
        df_data = pd.DataFrame(columns=cols)

        for i, trial in enumerate(data):
            df_data.loc[i, 'subject_id'] = trial['subjectId']
            df_data.loc[i, 'student_idx'] = trial['studentIndex']
            df_data.loc[i, 'block_type'] = trial['scenario']
            df_data.loc[i, 'trial_num'] = 0 if trial['exampleSet'] == 'first' else 1
            df_data.loc[i, 'trueStemThresh'] = trial['stemThreshold']
            df_data.loc[i, 'trueCapThresh'] = trial['capThreshold']
            df_data.loc[i, 'trueStemDir'] = trial['stemDirection']
            df_data.loc[i, 'trueCapDir'] = trial['capDirection']
            df_data.loc[i, 'prior'] = trial['prior']

            if trial['rt'] != None:
                df_data.loc[i, 'stemResponse'] = trial['response1']
                df_data.loc[i, 'capResponse'] = trial['response2']

            if (trial['scenario'] == 'seqFeedback') & (trial['exampleSet'] == 'first'):
                df_data.loc[i, 'feedbackStemThresh'] = trial['feedback']['stemThreshold']
                df_data.loc[i, 'feedbackCapThresh'] = trial['feedback']['capThreshold']
                df_data.loc[i, 'feedbackStemDir'] = trial['feedback']['stemDirection']
                df_data.loc[i, 'feedbackCapDir'] = trial['feedback']['capDirection']

        df_data['understood'] = demographics['response']['understood']
        df_data['pass_attention'] = demographics['passAllAttentionChecks']
        df_data['n_attention_passed'] = demographics['nAttentionChecksPassed']

        dfs_demographics.append(df_demographics)
        dfs_data.append(df_data)

    df_demographics_all = pd.concat(dfs_demographics, ignore_index=True)
    df_data_all = pd.concat(dfs_data, ignore_index=True)

    df_demographics_all.to_csv(os.path.join(
        out_dir, f"{expt_label}_demographics.csv"), index=False)
    df_data_all.to_csv(os.path.join(out_dir, f"{expt_label}_data.csv"), index=False)

