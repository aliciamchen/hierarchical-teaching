library(here)
library(tidyverse)
library(digest)

# Clean exp1 data

d.raw <- read_csv(here('data/preprocessed/exp1_data.csv'))

d <- d.raw %>%
  rename(n_turtles = total_ex) %>%
  mutate(
    sequential = ifelse(
      block_type == "nonSeqFull" |
        block_type == "nonSeqPartial",
      "non_sequential",
      "sequential"
    ),
    feedback = ifelse(block_type == "seqFeedback", "feedback", "no_feedback"),
    teacher_knowledge = ifelse(block_type == "nonSeqFull", "full", "partial"),
    student_prior = ifelse((theta == 0.3 &
                              student_a == 1) |
                             (theta == 0.7 & student_a == 9),
                           "too_high",
                           "too_low"
    ),
    n_majority = ifelse(theta == 0.7, heads, tails),
    n_minority = n_turtles - n_majority,
    lesson_num = ifelse(trial_num == 0, 'lesson1', 'lesson2'),
    trial_num = factor(student_idx)
  )

# Anonymize participants
d$subject_id <- sapply(d$subject_id, digest)

d %>%
  mutate(theta = 0.7) %>%
  select(
    c(
      subject_id,
      trial_num,
      lesson_num,
      sequential,
      feedback,
      teacher_knowledge,
      theta,
      student_prior,
      n_majority,
      n_turtles
    )
  ) %>%
  write_csv(here('data/exp1_data_cleaned.csv'))


# Clean exp1 model

d.model <-
  read.csv(here('model/exp1/output/combined.csv')) %>%
  mutate(
    n_turtles = heads + tails,
    sequential = ifelse(
      block_type == "nonSeqFull" |
        block_type == "nonSeqPartial",
      "non_sequential",
      "sequential"
    ),
    feedback = ifelse(block_type == "seqFeedback", "feedback", "no_feedback"),
    teacher_knowledge = ifelse(block_type == "nonSeqFull", "full", "partial"),
    student_prior = ifelse((theta == 0.3 &
                              student_a == 1) |
                             (theta == 0.7 & student_a == 9),
                           "too_high",
                           "too_low"
    ),
    n_majority = ifelse(theta == 0.7, heads, tails),
    n_minority = n_turtles - n_majority,
    lesson_num = ifelse(trial_num == 0, 'lesson1', 'lesson2')
  )

d.model %>%
  mutate(theta = 0.7) %>%
  select(
    c(
      subject_id,
      alpha,
      priorWeight,
      costWeight,
      lesson_num,
      sequential,
      feedback,
      teacher_knowledge,
      theta,
      student_prior,
      n_majority,
      n_turtles
    )
  ) %>%
  write_csv(here('model/cleaned_outputs/exp1_simulation_cleaned.csv'))
