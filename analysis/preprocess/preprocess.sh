python preprocess_exp1.py --in_dir data/teacher_1d/raw/full_sample --out_dir data/preprocessed --expt_label exp1
python preprocess_exp2.py --in_dir data/learner/raw/full_sample --out_dir data/preprocessed --expt_label exp2

Rscript clean_exp1.R
Rscript clean_exp2.R