library(here)
library(tidyverse)
library(lme4)
library(lmerTest)
library(brms)
library(ggthemes)
library(tidyboot)

options(contrasts = c(unordered = "contr.sum", ordered = "contr.poly"))

theme_set(theme_few(base_size = 15))