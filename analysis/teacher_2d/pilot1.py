import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# %%

filename = '../../data/teacher_2d/pilot1/expt3_data.csv'
df = pd.read_csv(filename)

# %%

def check_corner(stemThresh, capThresh, stemDir, capDir):
