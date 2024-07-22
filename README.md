# hierarchical-teaching

A hierarchical Bayesian model of adaptive teaching

Alicia M. Chen, Andrew Palacci, Natalia Vélez, Robert D. Hawkins*, Samuel J. Gershman*

Cognitive Science, 2024

Paper: https://doi.org/10.1111/cogs.13477
OSF project: https://osf.io/ubxjr

## Preregistrations

Preregistrations for both experiments can be found at https://osf.io/ubxjr/registrations

## Respository contents

- `data` contains cleaned and anonymized data for both experiments. See `data/README.md` for codebook.
- `analysis` contains code to preprocess raw experiment data + model outputs, and code to reproduce all the analyses and plots in the paper
    - To reproduce analyses and plots, run `analysis/run_stats.sh`. Stats will be saved in `analysis/outputs` and figures will be saved in `writing/outputs`.
    - To preprocess raw data from the experiment, see `analysis/preprocess/README.md`.
- `writing` contains the figures
    - `writing/outputs` contains the plot outputs directly from the analysis scripts, and `writing/figs.pdf` contains the figure files as is in the paper.
- `experiments` contains the code for running both experiments
- `model` contains the WebPPL code for the simulations
    - To reproduce model simulations, run `model/exp1/run_simulation.sh` and `model/exp2/run_simulation.sh`. Outputs will be saved in `model/exp1/output` and `model/exp2/output`.

## R session info

```{r}
sessionInfo()
R version 4.4.0 (2024-04-24)
Platform: aarch64-apple-darwin20
Running under: macOS Sonoma 14.4.1

Matrix products: default
BLAS:   /System/Library/Frameworks/Accelerate.framework/Versions/A/Frameworks/vecLib.framework/Versions/A/libBLAS.dylib
LAPACK: /Library/Frameworks/R.framework/Versions/4.4-arm64/Resources/lib/libRlapack.dylib;  LAPACK version 3.12.0

locale:
[1] en_US.UTF-8/en_US.UTF-8/en_US.UTF-8/C/en_US.UTF-8/en_US.UTF-8

time zone: America/New_York
tzcode source: internal

attached base packages:
[1] stats     graphics  grDevices utils     datasets  methods   base

other attached packages:
 [1] afex_1.3-1      lmerTest_3.1-3  lme4_1.1-35.3   Matrix_1.7-0    patchwork_1.2.0 scales_1.3.0    ggpubr_0.6.0    ggthemes_5.1.0
 [9] tidyboot_0.1.1  lubridate_1.9.3 forcats_1.0.0   stringr_1.5.1   dplyr_1.1.4     purrr_1.0.2     readr_2.1.5     tidyr_1.3.1
[17] tibble_3.2.1    ggplot2_3.5.1   tidyverse_2.0.0 here_1.0.1

loaded via a namespace (and not attached):
 [1] gtable_0.3.5        rstatix_0.7.2       lattice_0.22-6      numDeriv_2016.8-1.1 tzdb_0.4.0          vctrs_0.6.5
 [7] tools_4.4.0         generics_0.1.3      parallel_4.4.0      fansi_1.0.6         pkgconfig_2.0.3     lifecycle_1.0.4
[13] compiler_4.4.0      farver_2.1.1        textshaping_0.3.7   munsell_0.5.1       carData_3.0-5       nloptr_2.0.3
[19] pillar_1.9.0        car_3.1-2           crayon_1.5.2        MASS_7.3-60.2       boot_1.3-30         abind_1.4-5
[25] nlme_3.1-164        tidyselect_1.2.1    mvtnorm_1.2-4       stringi_1.8.3       reshape2_1.4.4      labeling_0.4.3
[31] splines_4.4.0       cowplot_1.1.3       rprojroot_2.0.4     grid_4.4.0          colorspace_2.1-0    cli_3.6.2
[37] magrittr_2.0.3      utf8_1.2.4          broom_1.0.5         withr_3.0.0         backports_1.4.1     estimability_1.5.1
[43] timechange_0.3.0    modelr_0.1.11       emmeans_1.10.1      gridExtra_2.3       ggsignif_0.6.4      ragg_1.3.0
[49] hms_1.1.3           coda_0.19-4.1       viridisLite_0.4.2   rlang_1.1.3         Rcpp_1.0.12         xtable_1.8-4
[55] glue_1.7.0          rstudioapi_0.16.0   minqa_1.2.6         plyr_1.8.9          R6_2.5.1            systemfonts_1.0.6
```

## Contact

aliciach@mit.edu
