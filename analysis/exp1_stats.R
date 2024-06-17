library(here)
library(tidyverse)
library(tidyboot)
library(lme4)
library(lmerTest)
library(afex)

options(contrasts = c(unordered = "contr.sum", ordered = "contr.poly"))
d.data <- read.csv(here("data/exp1_data_cleaned.csv"))

nonseq.mod <- lmer_alt(
  n_majority / n_turtles ~ 1
  + student_prior * teacher_knowledge
  + (1 + student_prior * teacher_knowledge | subject_id),
  data = d.data,
  control = glmerControl(optimizer = "bobyqa"),
  family = binomial,
  weights = d.data$n_turtles
)

summary(nonseq.mod)

d.toohigh <-
  d.data %>% filter(sequential == "sequential", student_prior == "too_high")

seq.mod.toohigh <- lmer_alt(
  n_majority / n_turtles ~ 1 + lesson_num * feedback + (1 + lesson_num * feedback |
                                                         subject_id),
  data = d.toohigh,
  weights = d.toohigh$n_turtles,
  family = "binomial",
  control = glmerControl(optimizer = "bobyqa")
)


summary(seq.mod.toohigh)

d.toolow <-
  d.data %>% filter(sequential == "sequential", student_prior == "too_low")

seq.mod.toolow <- lmer_alt(
  n_majority / n_turtles ~ 1 + lesson_num * feedback + (1 + lesson_num * feedback |
                                                         subject_id),
  data = d.toolow,
  weights = d.toolow$n_turtles,
  family = "binomial",
  control = glmerControl(optimizer = "bobyqa")
)

summary(seq.mod.toolow)
