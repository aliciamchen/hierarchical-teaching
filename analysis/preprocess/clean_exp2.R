library(here)
library(tidyverse)
library(digest)

n.ex.teacher <- 5

# Clean exp2 data

d.raw <- read.csv(here("data/preprocessed/exp2_data.csv"))

d <- d.raw %>%
  filter(is.finite(first_examples_a) == TRUE ||
           is.finite(second_examples_a) == TRUE) %>%
  mutate(
    first_examples_a = ifelse(student_a == 9, first_examples_a, 5 - first_examples_a),
    first_examples_b = ifelse(student_a == 9, first_examples_b, 5 - first_examples_b),
    theta = ifelse(student_a == 9, round(theta, 1), round(1 - theta, 1)),
    first_guess = ifelse(student_a == 9, round(first_guess, 1), round(1 - first_guess, 1)),
    final_guess = ifelse(student_a == 9, round(final_guess, 1), round(1 - final_guess, 1)),
    guess = ifelse(feedback_choice == 'yes', TRUE, FALSE),
    teacher_knowledge = block_type
  ) %>%
  group_by(subject_id, island_idx, theta) %>%
  summarize(# right now each lesson has its own row, so this is for combining each trial into a row
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
  filter(is.finite(first_examples_a) == TRUE,
         is.finite(second_examples_a) == TRUE) %>%
  mutate(
    first_guess = ifelse(guess == 1, first_guess, NA),
    # get rid of pesky Infs that pop up
    student_a = 9,
    student_b = 1
  )

d$subject_id <-
  sapply(d$subject_id, digest) # anonymize participants

d %>%
  select(
    c(
      subject_id,
      island_idx,
      teacher_knowledge,
      theta,
      student_a,
      student_b,
      first_examples_a,
      first_examples_b,
      guess,
      first_guess,
      second_examples_a,
      second_examples_b,
      final_guess
    )
  ) %>%
  write_csv(here('data/exp2_data_cleaned.csv'))


# Clean exp2 model
d.model <-
  read.csv(here("model/exp2/output/combined.csv")) %>%
  mutate(
    examples_a = ifelse(
      student_a == 9,
      first_examples_a,
      n.ex.teacher - first_examples_a
    ),
    examples_b = ifelse(
      student_a == 9,
      first_examples_b,
      n.ex.teacher - first_examples_b
    ),
    theta = ifelse(student_a == 9, theta, 1 - theta)
  ) %>%
  rename(guess = feedback_choice) %>%
  select(
    c(
      speaker_alpha,
      listener_alpha,
      guess_cost,
      theta,
      student_a,
      student_b,
      first_examples_a,
      first_examples_b,
      guess,
      first_guess
    )
  )

d.model %>%
  write_csv(here('model/cleaned_outputs/exp2_simulation_cleaned.csv'))

