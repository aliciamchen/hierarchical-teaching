import re,glob,json
from os.path import join as opj
import numpy as np

def str_extract(pattern, s): return re.search(pattern,s).group(0)
def int_extract(pattern, s): return int(str_extract(pattern, s))
def gsearch(*args): return glob.glob(opj(*args))

def read_json(path):
    with open(path, 'r') as f:
        data = json.load(f)
        
    return data

def write_json(data, path):
    with open(path, 'w') as f:
        json.dump(data, f)
        
def print_list(l, label='items'):
    '''
    Prints the length of a list and the first few items,
    truncates lists longer than 10 items. 
    
    Got tired of writing this out myself!
    '''
    
    print(f'Found {len(l)} {label}')
    if len(l) > 10:
        print(*l[:10], sep='\n')
        print('...')
    else:
        print(*l, sep='\n')
        
def upper_tri(RDM):
    """upper_tri returns the upper triangular index of an RDM

    Args:
        RDM 2Darray: squareform RDM

    Returns:
        1D array: upper triangular vector of the RDM
        
    Source: https://rsatoolbox.readthedocs.io/en/latest/demo_searchlight.html
    """
    # returns the upper triangle
    m = RDM.shape[0]
    r, c = np.triu_indices(m, 1)
    return RDM[r, c]