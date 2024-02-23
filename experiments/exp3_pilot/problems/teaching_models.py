#!/usr/bin/env python
# coding: utf-8

# # Teaching models with speaker preferences
# Natalia Vélez & Alicia Chen, last updated May 2023

import os, sys, pprint
import numpy as np
import pandas as pd
from ast import literal_eval as eval_tuple
from os.path import join as opj
from scipy.stats import entropy
from scipy.spatial import distance
from scipy.special import softmax
import scipy.optimize, scipy.sparse
import scipy.ndimage as ndimage
import matplotlib.pyplot as plt
import seaborn as sns

sys.path.append('..')
from utils import read_json, write_json, int_extract
cwd = os.path.abspath(os.path.dirname(__file__))

## ====== SETUP ====== 
# Load teaching problems:
print('Loading teaching problems')
problems = read_json(opj(cwd, 'inputs/problems.json'))
pprint.pprint(problems[0])

# Load exclusions:
print('Participants excluded from analysis:')
excluded = np.loadtxt('../1_preprocessing/outputs/excluded_participants.txt', dtype=str)
excluded = [int_extract('[0-9]+', s) for s in excluded]
print(excluded)

# Load teaching data:
def read_coords(e):
    '''
    Helper function: Converts string of coordinates into a flat index on a 6x6 array
    e.g., "(5,5)"  => 35
    '''
    coords = eval_tuple(e)
    idx = np.ravel_multi_index(coords, (6,6))
    
    return idx

print('Cleaning up human behavioral data')
human_df = pd.read_csv(opj(cwd, 'outputs/teaching_behavior.csv'))
human_df = human_df.drop(columns=['onset', 'rating']) # drop columns that are irrelevant for model
human_df = human_df[~human_df.subject.isin(excluded)] # exclude wiggly participants
human_df = human_df[~pd.isna(human_df.example)] # exclude trials where teachers failed to respond

# keep track of cursor locations
grouped_df = human_df.groupby(['subject', 'run', 'block_idx'])
human_df['cursor_coords'] = grouped_df['example'].shift()
human_df.loc[grouped_df.head(1).index, 'cursor_coords'] = 'start'
human_df['cursor_coords'] = np.where(human_df.cursor_coords == 'start', human_df.start, human_df.cursor_coords)

# keep examples in coord form, just in case
human_df['example_coords'] = human_df.example.apply(eval_tuple)

# convert tuples of coordinates into flat indices
human_df['example'] = human_df.example.apply(read_coords)
human_df['cursor'] = human_df.cursor_coords.apply(read_coords)

pprint.pprint(human_df.head(15))

## ====== UTILS ====== 
def plot_problem(prob_idx):
    '''
    Plot a teaching problem. By convention, A is the correct answer.
    (In practice, the order in which these hypotheses are presented were counterbalanced
    across students.)
    '''
    
    prob = list(problems[prob_idx].items())

    fig,axes = plt.subplots(1, len(prob), figsize=(4*len(prob), 4))
    for idx, (k,v) in enumerate(prob):
        sns.heatmap(v, cmap='Greys', square=True, cbar=False, ax=axes[idx], lw=1, linecolor='#aaa')
        axes[idx].set(xticklabels=[], yticklabels=[], title=k)
        
    fig.suptitle(f'Problem {prob_idx}')
        
    return fig

def hypotheses_dataframe(hypotheses):
    '''
    general method: converts (4,6,6) array (used, e.g., in teaching problems, priors, etc.) 
    into an examples x hypotheses dataframe
    '''
    
    hypotheses_flat = np.reshape(hypotheses, (hypotheses.shape[0], hypotheses.shape[1]*hypotheses.shape[2])) #  flatten 3d => 2d array
    
    ### reshape into dataframe of coordinates x hypotheses
    df = pd.DataFrame(hypotheses_flat).stack().rename_axis(['hypothesis', 'idx']).reset_index(name='val')
    
    # name hypotheses
    df['hypothesis'] = pd.Categorical(df.hypothesis)
    df['hypothesis'] = df.hypothesis.cat.rename_categories(['A', 'B', 'C', 'D'])
    df['hypothesis'] = df['hypothesis'].astype('object')
    
    # spread each hypothesis into its own column
    df = df.pivot(index='idx', columns='hypothesis', values='val')
    df = df[df.sum(axis=1) > 0]
    
    return df

def problem_df(prob_idx):
    '''
    reads problem and converts to dataframe
    '''
    prob = problems[prob_idx]
    hypotheses = np.array(list(prob.values())) # read hypothesis space
    df = hypotheses_dataframe(hypotheses)
    
    return df

def filter_consistent_examples(prob_idx, past_examples=[]):
    '''
    Returns a matrix of examples x hypotheses, where each entry indicates whether a given hypothesis is consistent with this next example *and all examples that came before it*

    '''
    example_space = problem_df(prob_idx)
    possible_examples = example_space.copy()
    
    for ex in past_examples:
        consistent_with_past = possible_examples.loc[ex] # which hypotheses did this hypothesis rule out?
        possible_examples = possible_examples.drop(ex) # drop past examples from consideration
        
        # drop hypotheses that are incompatible with this past example
        possible_examples = possible_examples.mul(consistent_with_past, axis=1)
        possible_examples = possible_examples[possible_examples.columns[possible_examples.sum()>0]]
        
    return possible_examples

def full_belief(nonzero_belief):
    '''
    Return full belief distribution (used to generate model predictions)
    '''
    belief = nonzero_belief.reindex(['A', 'B', 'C', 'D'], fill_value=0)
    return belief


def series2tuple(s):
    '''
    Convert a pandas dataseries to a list of (index, value) tuples; we're going to use this to save model predictions to JSON files
    '''
    return list(zip(s.index,s))


def sampling_matrix(pD):    
    '''
    Convert a pD into a 6x6 heatmap
    '''
    # matrix of full coordinates
    all_coords = pd.DataFrame([(i,j) for i in range(6) for j in range(6)],
                             columns=['row', 'col'])

    # get full sampling distribution
    preds = pD['A'].copy().reset_index()
    preds['coords'] = preds.idx.apply(lambda i: np.unravel_index(i, (6,6)))

    # "unravel" flat indices into 2d coordinates?
    coords_2d = preds.coords.apply(pd.Series)
    coords_2d.columns = ['row', 'col']

    # put it together
    preds = pd.concat([preds, coords_2d], axis=1)
    preds = preds.drop(columns=['idx', 'coords'])
    preds = all_coords.merge(preds,how='left')

    # convert df of coordinates into 2d matrix
    preds = preds.pivot('row', 'col', 'A').values
    preds = np.nan_to_num(preds)
    
    return preds

def masked_softmax(col, temp=1):
    '''     
    Helper function: Select among viable (non-nan) alternatives
    using a softmax function
    '''
    result_col = col.copy()
    is_finite = np.isfinite(result_col)
    finite_vals = result_col[is_finite]
    
    pChoice = softmax(temp*finite_vals)
    result_col[is_finite] = pChoice
    
    return result_col

## ====== CALCULATING UTILITY ======
## INFORMATIONAL VALUE
# Define the belief updating method:
def pedagogical_belief_updating(prob_idx, past_examples, last_pH):
    '''
    In sequential cooperative Bayesian inference (Wang, Wang & Shafto, 2020), 
    the posterior on the last trial is then passed on as the prior for the next trial. 
    
    Or, in other words... "yesterday's posterior is tomorrow's prior"
    This function then updates the learner's beliefs according to:
    P(H|D) = P(H)P(D|H) / P(D)
    '''
    # drop past examples (can't be repeated)
    pD = filter_consistent_examples(prob_idx, past_examples=past_examples)
    pD = pD.div(pD.sum(axis=0), axis=1) # normalize columns
    
    # update pH
    last_example = past_examples[-1]
    yesterdays_posterior = last_pH.loc[last_example]
    prior_unnorm = pD.mul(yesterdays_posterior, axis=1)
    tomorrows_prior = prior_unnorm.div(prior_unnorm.sum(axis=1), axis=0)
    
    # drop hypotheses that are incompatible with past examples
    # (makes some of the math nicer - otherwise we'll run into divide-by-0 errors in Sinkhorn scaling)
    tomorrows_prior = tomorrows_prior[tomorrows_prior.columns[tomorrows_prior.sum()>0]]
    
    return tomorrows_prior


# Define the sampling method:
def pedagogical_sampling(prob_idx, past_examples=[], last_pH=None, nIter=10):
        
    if len(past_examples):
        pH = pedagogical_belief_updating(prob_idx, past_examples, last_pH)
    # else: start from a uniform prior
    else:
        hypothesis_space = problem_df(prob_idx)
        uniform_prior = hypothesis_space.div(hypothesis_space.sum(axis=1), axis=0)
        pH = uniform_prior
        
    # ~ recursive reasoning ~
    for _ in range(nIter):
        pD = pH.div(pH.sum(axis=0), axis=1)
        pH = pD.div(pD.sum(axis=1), axis=0)
        
    return pD, pH

# Simpler sampling method (for an alternative full model)
def strong_sampling(prob_idx, past_examples=[], last_pH=None, nIter=10):
    '''
    pH is uniformly distributed among hypotheses that are consistent with past examples
    pD is unformly distributed among available examples
    
    We remove columns corresponding to hypotheses that have been ruled out,
    and rows corresponding to poitns that are not present in any remaining hypotheses.
    '''
    
    hypothesis_space = filter_consistent_examples(prob_idx, past_examples=past_examples)
    pH = hypothesis_space.div(hypothesis_space.sum(axis=1), axis=0).dropna(axis='index')
    
    pD = hypothesis_space.div(hypothesis_space.sum(axis=0), axis=1)
    pD = pD.loc[pD.sum(axis=1) > 0]
    
    return pD, pH

## SPEAKER PREFERENCES
def filter_func(values):
    '''
    Helper: Returns sum of # neighbors
    '''
    return values.sum()

def edge_pref(prob):
    '''
    Returns a dataframe of examples, weighted by the # of negative examples surrounding each point
    '''
    
    # kernel used to count neighbors
    footprint = np.array([[1,1,1],
                          [1,0,1],
                          [1,1,1]])

    # expand array
    prob_arr = np.array(list(prob.values()))
    h_expanded = np.zeros((4,8,8), dtype=int)
    h_expanded[:,1:7,1:7] = prob_arr

    # count # neighbors
    expanded_neighbors = np.array([ndimage.generic_filter(h_expanded[h,:,:], filter_func, footprint=footprint) 
                                   for h in range(4)])

    # make array of weights inv. related to number of neighbors
    n_neighbors = expanded_neighbors[:, 1:7, 1:7]
    weight_arr = np.multiply(prob_arr, 9-n_neighbors)
    weight_sums = weight_arr.sum(axis=(1,2))
    edge_weights = np.divide(weight_arr, weight_sums[:, np.newaxis, np.newaxis])

    # save as dataframe
    edge_df = hypotheses_dataframe(edge_weights)
    return edge_df
    
# Dictionary of preference functions
pref_dict = {
    'edge': edge_pref,
}

# COST, based on movement distance
def movement_cost(prob_idx, past_examples=[], start=0):
    '''
    Assigns a cost to examples based on Manhattan distance between each point and the cursor's starting point
    '''    
    # read hypothesis space
    prob = problems[prob_idx]
    hypothesis_space = np.array(list(prob.values()))
    cost_df =  filter_consistent_examples(prob_idx, past_examples)
    cost_df[cost_df == 0] = np.nan
    
    # where is the cursor now?
    if len(past_examples):
        cursor = past_examples[-1]
    else:
        cursor = start
    cursor = np.unravel_index(cursor, hypothesis_space.shape[1:])

    # measure distance from cursor
    cost_df['coords'] = cost_df.index.map(lambda c: np.unravel_index(c, hypothesis_space.shape[1:]))
    distances = cost_df.coords.apply(lambda c: distance.cityblock(cursor, c))

    # clean up dataframe
    cost_df = cost_df.drop(columns=['coords'])
    cost_df = cost_df.mul(distances, axis=0)/10 # scaled (max distance is 10)
    return cost_df


## ====== SAMPLING METHOD ====== 
def utility_sampling(prob_idx, weights=np.ones(3), sampling_fun=None, pref_fun=None, past_examples=[], start=0, last_pH=None, nIter=20):
    '''
    Estimate the teacher's sampling distribution (p_T(d;h)) as a sum of competing goals weighted by weight_vec
    '''
    # get all available examples
    available_examples = filter_consistent_examples(prob_idx, past_examples=past_examples)
    
    # info value
    _,pH = sampling_fun(prob_idx, past_examples, last_pH, nIter)
    info_value = pH.copy().apply(np.log)
    
    # movement cost
    cost = movement_cost(prob_idx, past_examples, start)
    
    # speaker preferences
    speaker_pref = pref_fun(problems[prob_idx])
    speaker_pref = speaker_pref.loc[available_examples.index, available_examples.columns] # filter
    speaker_pref = speaker_pref/speaker_pref.sum(axis=0) # renormalize columns
    
    # utility
    utility = weights[0]*info_value + weights[1]*speaker_pref - weights[2]*cost
    pD = utility.apply(lambda col: masked_softmax(col))
    pD = pD.fillna(0)
    
    return pD, pH

def utility_model_predictions(data=None, sampling_fun=None, pref_fun=None, weights=np.ones(3), nIter=20):
    '''
    Iterate through data and generate model predictions
    '''
    model_outputs = []
    
    # initialize inputs to sampler
    examples = []
    pH = None
    pD = None
    
    # initialize belief distribution
    # (uniform prior over hypotheses)
    belief = np.ones(4)*.25
    belief_in_true = belief[0]
    
    for _, row in data.iterrows():
        ex = row.example
        out = row.copy()
        out['model'] = 'utility'

        # likelihood of observed data, assuming pedagogical sampling
        pD, pH = utility_sampling(row.problem, sampling_fun=sampling_fun, pref_fun=pref_fun, past_examples=examples, start=row.cursor, last_pH=pH, nIter=nIter, weights=weights)
        out['lik'] = pD['A'].loc[ex]
        out['pD'] = series2tuple(pD['A']) # full sampling distribution
        
        # learner's posterior belief given the data
        new_belief = full_belief(pH.loc[ex])
        out['pTrue'] = new_belief['A']
        out['pH'] = series2tuple(new_belief) # full belief distribution
        out['entropy'] = entropy(new_belief.values) # entropy of belief distribution
        
        # change in beliefs
        out['delta'] = new_belief['A'] - belief_in_true
        out['KL'] = entropy(new_belief.values, belief)        
        
        belief = new_belief.values # change values for next round
        belief_in_true = belief[0]
        
        out = out.to_dict()
        examples.append(ex)
        model_outputs.append(out)
        
    return model_outputs

## ====== GENERATING SIMULATED DATA ====== 
def simulate_problem(idx, prob, sampling_fun=None, pref_fun=None, weights=np.ones(3), nIter=20): 
    '''
    Generate simulated data for a single teaching problem using utility-maximizing problem
    & given parameter settings
    '''
    # start block
    start = np.random.choice([0, 5, 30, 35]) # select a corner of the map at random
    pH = None
    examples =[]
    sim = []

    for trial in range(3):
        # sampling method
        pD, pH = utility_sampling(prob, weights=weights, sampling_fun=sampling_fun, pref_fun=pref_fun, past_examples=examples,
                                  start=start, last_pH=pH, nIter=nIter)
        
        # pick out examples
        ex = np.random.choice(pD.index, p=pD.A)

        # set things up for next iteration
        examples.append(ex)
        sim.append((weights, idx, prob, start, ex))
        start = ex

    # clean up outputs
    sim_df = pd.DataFrame(sim, columns=['weight', 'niter', 'problem', 'cursor', 'example'])
    return sim_df

def simulate_dataset(idx, sampling_fun=None, pref_fun=None, weights=np.ones(3), nIter=20):
    '''
    Generate simulated data for a full run of the task, using the utility-maximizing
    mowith given parameter settings
    '''
    # iterate over all weights problems
    sim_list = [simulate_problem(idx, prob, sampling_fun=sampling_fun, pref_fun=pref_fun, weights=weights, nIter=nIter) for prob in range(40)]
    
    # clean up outputs
    sim_df = pd.concat(sim_list)
    return sim_df

## ====== FIT MODEL FREE PARAMETERS ====== 
def eval_fit(x, args):
    '''
    Main function: Returns -loglik of data
    '''
    
    # 'weights' combines values sampled from the minimizer (x)
    # with fixed weights stored in args['weights']
    # (the latter are used to make lesioned models. each fixed
    # parameter is given a numerical value, and the rest are None)
    # e.g., an info-maximizing model would have weights of: [None, 0, 0]
    weights = args['weights'].copy()
    weights[weights == None] = x
#   np.where(args['weights'] == None, x, args['weights'])
    
    inputs = {
        'weights': weights,
    }
    
    # merge with other args
    opts = {**args}
    del opts['weights'] # do not overwrite with default weights again!
    inputs = {**inputs, **opts}
    
    # generate model predictions
    sub_predictions = []
    for prob, group in args['data'].groupby('problem'): # iterate through all teaching problems
        prob_inputs = {**inputs}
        prob_inputs['data'] = group
        pred = utility_model_predictions(**prob_inputs)
        pred = pd.DataFrame(pred)
        sub_predictions.append(pred)
        
    # calculate log likelihood
    sub_predictions = pd.concat(sub_predictions)
    sub_predictions['loglik'] = np.log(sub_predictions.lik)
    loglik = sub_predictions['loglik'].sum()
    
    return -loglik

def clean_outputs(v):
    '''
    Helper function: Cleans up outputs of res to make it easier to save
    '''
    
    if isinstance(v, list):
        # Critical! Cleans up lists recursively
        # (some fields have ndarrays nested inside lists)
        return [clean_outputs(v_i) for v_i in v]
    elif isinstance(v, np.ndarray):
        return v.tolist()
    elif isinstance(v, scipy.sparse.spmatrix):
        return v.todense().tolist()
    elif isinstance(v, np.bool_):
        return bool(v)
    else:
        return v

def model_optimize(label:str, *args, **kwargs):
    '''
    Main model-fitting function
        label: Label for current run of the optimiziation function
        *args, **kwargs: Arguments to scipy.optimize
    '''
    # Defines defaults, and replaces with user input where applicable    
    a = kwargs.get('args')
    n_params = np.sum(a['weights'] == None)
    
    defaults = {
        'bounds': [(0,None)]*n_params,
        'method': 'SLSQP', 
        'options': {'disp': True},
        'args': {
            'nIter': 20,
            'data': None, # you need to replace this when you call this fun!
            'weights': np.array([None, None, None])
        }
    }
    
    # Initial guess
    x0 = [1]*n_params
    print(f'Initial guess: {x0}')
    
    opts = {**defaults, **kwargs}
    
    print('Model fitting using scipy.optimize...')
    # Call to optimizer
    res = scipy.optimize.minimize(eval_fit, x0, *args, **opts)
    
    print('Done with model fitting! Cleaning up outputs')
    res_out = {k:clean_outputs(v) for k,v in res.items()}
    res_out['label'] = label
    
    return res_out

