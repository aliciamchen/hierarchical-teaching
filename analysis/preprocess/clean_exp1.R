library(here)
library(tidyverse)
library(digest)

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
    proportion_majority = n_majority / n_turtles,
    trial_num = ifelse(trial_num == 0, 'lesson1', 'lesson2'),
    student_idx = factor(student_idx)
  )

# Anonymize participants
d$subject_id <- sapply(d$subject_id, digest)

d %>%
  select(
    c(
      subject_id,
      student_idx,
      trial_num,
      sequential,
      feedback,
      teacher_knowledge,
      student_prior,
      student_a,
      student_b,
      n_majority,
      n_turtles
    )
  ) %>%
  write_csv(here('data/exp1_data_cleaned.csv'))
