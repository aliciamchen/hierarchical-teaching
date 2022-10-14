# Clean and preprocess all outputs: `preprocess.sh`

- `preprocess.exp1.py` and `preprocess_exp2.py` handle the raw `.json` data from the experiment and save the outputs in `../data`
- `clean_exp1.R` and `clean_exp2.R` take the outputs of the `.py` files (and the model outputs in `../model/exp1` and `../model/exp2`), handle counterbalancing and anonymization, and make them tidy for plotting
    - Anonymized experiment data saved in `../data`
    - Simulations saved in `../model/cleaned_outputs`