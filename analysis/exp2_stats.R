library(here)
library(tidyverse)
library(lme4)
library(lmerTest)

d <- read.csv(here("data/exp2_data_cleaned.csv"))
options(contrasts = c(unordered = "contr.sum", ordered = "contr.poly"))



# Do participants do better after receiving the second set of examples?

d.guesses <- d %>% 
  mutate(correct_first_guess = first_guess == theta, 
         correct_final_guess = final_guess == theta) %>% 
  pivot_longer(cols = starts_with("correct"), 
               names_prefix = "correct_",
               names_to = "stage", 
               values_to = "correct") 

guess.means <- d.guesses %>% 
  group_by(stage) %>% 
  summarize(mean(correct, na.rm = TRUE))

guess.means

guess.mod <- glmer(
  correct ~ 1 + stage + (stage | subject_id), 
  data = d.guesses, 
  family = binomial
)

summary(guess.mod)


# Do participants do better after providing a guess?

guess.mod.inter <- glmer(
  correct ~ 1 + teacher_knowledge * guess + (1 | subject_id), 
  data = d.guesses %>% filter(stage == 'final_guess'), 
  family = binomial, 
  control = glmerControl(optimizer = "bobyqa")
)

summary(guess.mod.inter)



# Preregistered confirmatory analysis

mod <- glmer(
  guess ~ 1 + poly(first_examples_a, 2) + (1 + poly(first_examples_a, 2) | subject_id),
  data = d,
  family = binomial,
  control = glmerControl(optimizer = "bobyqa"),
)

summary(mod)
