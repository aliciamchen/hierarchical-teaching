library(here)
library(tidyverse)
library(lme4)
library(lmerTest)

d <- read.csv(here("data/exp2_data_cleaned.csv"))

mod <- glmer(
  guess ~ 1 + poly(first_examples_a, 2) + (1 + poly(first_examples_a, 2) | subject_id),
  data = d,
  family = binomial,
  control = glmerControl(optimizer = "bobyqa"),
)

summary(mod)
