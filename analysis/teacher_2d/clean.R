library(here)
library(tidyverse)

d.raw <- read.csv(here('data/teacher_2d/pilot1/expt3_data.csv'))

cat("Total participants: ", length(unique(d.raw$subject_id)), "\n")

d <- d.raw %>%
  mutate(
    sequential = ifelse(
      block_type == "nonSeqFull" |
        block_type == "nonSeqPartial",
      "non_sequential",
      "sequential"
    ),
    feedback = ifelse(block_type == "seqFeedback", "feedback", "no_feedback"),
    teacher_knowledge = ifelse(block_type == "nonSeqFull", "full", "partial"),
    trial_num = ifelse(trial_num == 0, 'lesson1', 'lesson2'),
    student_idx = factor(student_idx),
    stem_concept_size = ifelse(
      trueStemDir == 'greater',
      8.5 - trueStemThresh,
      trueStemThresh - 0.5
    ),
    cap_concept_size = ifelse(trueCapDir == 'greater', 8.5 - trueCapThresh, trueCapThresh - 0.5),
    stemDistFromBoundary = abs(stemResponse - trueStemThresh),
    capDistFromBoundary = abs(capResponse - trueCapThresh),
    stemDistFromBoundary_norm = abs(stemResponse - trueStemThresh) / stem_concept_size,
    capDistFromBoundary_norm = abs(capResponse - trueCapThresh) / cap_concept_size,
    corner = ifelse((abs(
      stemResponse - trueStemThresh
    ) == 0.5) &
      (abs(
        capResponse - trueCapThresh
      ) == 0.5), TRUE, FALSE),
    known_concept_size = ifelse(prior == "stem", stem_concept_size, cap_concept_size),
    unknown_concept_size = ifelse(prior == "stem", cap_concept_size, stem_concept_size),
    dist_from_known = ifelse(prior == "stem", stemDistFromBoundary, capDistFromBoundary),
    dist_from_unknown = ifelse(prior == "stem", capDistFromBoundary, stemDistFromBoundary)
  ) %>%
  select(-c(block_type, pass_attention)) %>%
  filter(understood == "yes", n_attention_passed == 3)

cat("Total participants after exclusions: ", length(unique(d$subject_id)))


d.seq.flat <- d %>%
  filter(sequential == 'sequential') %>%
  pivot_wider(
    names_from = trial_num,
    values_from = c("corner", "dist_from_known", "dist_from_unknown"),
    id_cols = c("subject_id",
                "student_idx",
                "prior",
                "feedback")
  )


# Longform data with collapsed values, for plotting
d.long <- d %>%
  pivot_longer(
    cols = starts_with("dist_from"),
    names_to = "known",
    names_prefix = "dist_from_",
    values_to = "dist"
  ) %>%
  mutate(concept_size = ifelse(known == "known", known_concept_size, unknown_concept_size)) %>%
  select(
    subject_id,
    sequential,
    feedback,
    trial_num,
    teacher_knowledge,
    student_idx,
    concept_size,
    known_concept_size,
    unknown_concept_size,
    corner,
    known,
    dist
  )



write.csv(d, here('data/teacher_2d/pilot1/cleaned_all.csv'))
write.csv(d.seq.flat,
          here('data/teacher_2d/pilot1/cleaned_seq_flat.csv'))
write.csv(d.long, here('data/teacher_2d/pilot1/cleaned_long.csv'))
