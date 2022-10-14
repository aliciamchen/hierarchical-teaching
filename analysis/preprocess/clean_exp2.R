library(here)
library(tidyverse)
library(digest)

d.raw <- read.csv(here("data/preprocessed/exp2_data.csv"))

d <- d.raw %>%
  filter(is.finite(first_examples_a) == TRUE || is.finite(second_examples_a) == TRUE) %>%
  mutate(
    first_examples_a = ifelse(student_a == 9, first_examples_a, 5 - first_examples_a),
    first_examples_b = ifelse(student_a == 9, first_examples_b, 5 - first_examples_b),
    theta = ifelse(student_a == 9, round(theta, 1), round(1 - theta, 1)),
    first_guess = ifelse(student_a == 9, round(first_guess, 1), round(1 - first_guess, 1)),
    final_guess = ifelse(student_a == 9, round(final_guess, 1), round(1 - final_guess, 1)),
    guess = ifelse(feedback_choice == 'yes', TRUE, FALSE),
    teacher_knowledge = teacher_knowledge / 100
  ) %>%
  group_by(subject_id, island_idx, block_type, theta) %>%
  summarize( # right now each lesson has its own row, so this is for combining each trial into a row
    across(
      c(
        first_examples_a,
        first_examples_b,
        guess,
        first_guess,
        teacher_knowledge,
        second_examples_a,
        second_examples_b,
        final_guess
      ),
      ~ max(.x, na.rm = T)
    )) %>%
  filter(is.finite(first_examples_a) == TRUE, is.finite(second_examples_a) == TRUE) %>% 
  mutate(
    first_guess = ifelse(guess == 1, first_guess, NA) # get rid of pesky Infs that pop up
  )

# Anonymize participants
d$subject_id <- sapply(d$subject_id, digest)

d %>%
  write_csv(here('data/exp2_data_cleaned.csv'))