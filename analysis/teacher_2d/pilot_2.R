library(here)
library(tidyverse)
library(lme4)
library(lmerTest)
library(brms)
library(ggthemes)
library(tidyboot)

options(contrasts = c(unordered = "contr.sum", ordered = "contr.poly"))

theme_set(theme_few(base_size = 15))

d <- read.csv(here('data/teacher_2d/pilot_2/cleaned_long.csv'))

d.seq <- d %>% filter(sequential == "sequential")
d.nonseq <- d %>% filter(sequential == "non_sequential")

# Non-sequential case 

d.nonseq.boundary = d.nonseq %>% filter(boundary_type == "unknown") %>% 
  group_by(teacher_knowledge) %>% 
  tidyboot_mean(selected_on_boundary, na.rm = TRUE)

ggplot(data = d.nonseq.boundary, aes(x = teacher_knowledge, y = empirical_stat)) + 
  geom_point(size = 2, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  geom_hline(yintercept = 0.5, linetype = "dashed") +
  labs(y = "mushroom chosen on unknown boundary", title = "non-sequential")

d.nonseq.boundary = d.nonseq %>% 
  group_by(teacher_knowledge) %>% 
  tidyboot_mean(confidence, na.rm = TRUE)

ggplot(data = d.nonseq.boundary, aes(x = teacher_knowledge, y = empirical_stat)) + 
  geom_point(size = 2, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  labs(y = "confidence", title = "non-sequential")

# Break it down

d.nonseq.distances <- d.nonseq %>% filter(boundary_type == "unknown") %>% 
  group_by(teacher_knowledge, known_concept_size, unknown_concept_size) %>% 
  tidyboot_mean(
    selected_on_boundary, na.rm = T
  )

known_concept_size.labs <- c("known: 2", "known: 4", "known: 6")
names(known_concept_size.labs) <- c(2, 4, 6)

unknown_concept_size.labs <- c("unknown: 2", "unknown: 4", "unknown: 6")
names(unknown_concept_size.labs) <- c(2, 4, 6)

ggplot(d.nonseq.distances, aes(x = teacher_knowledge, y = empirical_stat)) + 
  geom_point(size = 1.5, position = position_dodge(width = 0.15)) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.15)) + 
  theme(aspect.ratio = 1) + 
  scale_color_discrete(labels = c("known boundary", "unknown boundary")) +
  geom_hline(yintercept = 0.5, linetype = "dashed") +
  labs(x = "teacher knowledge", y = "mushroom chosen on unknown boundary", title = "non sequential") +
  facet_grid(known_concept_size ~ unknown_concept_size, labeller = labeller(known_concept_size = known_concept_size.labs, unknown_concept_size = unknown_concept_size.labs)) + 
  theme_few(base_size = 14)


# Sequential 

d.seq.boundary = d.seq %>% filter(trial_num == 'lesson2', boundary_type == "unknown") %>% 
  group_by(feedback) %>% 
  tidyboot_mean(selected_on_boundary, na.rm = TRUE)

ggplot(data = d.seq.boundary, aes(x = feedback, y = empirical_stat)) + 
  geom_point(size = 2, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  geom_hline(yintercept = 0.5, linetype = "dashed") +
  labs(y = "mushroom chosen on unknown boundary", title = "sequential lesson 2")

d.nonseq.boundary = d.seq %>% filter(trial_num == 'lesson2') %>% 
  group_by(feedback) %>% 
  tidyboot_mean(confidence, na.rm = TRUE)

ggplot(data = d.nonseq.boundary, aes(x = feedback, y = empirical_stat)) + 
  geom_point(size = 2, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  labs(y = "confidence", title = "sequential lesson 2")


## Break it down

d.nonseq.distances <- d.seq %>% filter(trial_num == 'lesson2', boundary_type == "unknown") %>% 
  group_by(feedback, known_concept_size, unknown_concept_size) %>% 
  tidyboot_mean(
    selected_on_boundary, na.rm = T
  )

known_concept_size.labs <- c("known: 2", "known: 4", "known: 6")
names(known_concept_size.labs) <- c(2, 4, 6)

unknown_concept_size.labs <- c("unknown: 2", "unknown: 4", "unknown: 6")
names(unknown_concept_size.labs) <- c(2, 4, 6)

ggplot(d.nonseq.distances, aes(x = feedback, y = empirical_stat)) + 
  geom_point(size = 1.5, position = position_dodge(width = 0.15)) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.15)) + 
  theme(aspect.ratio = 1) + 
  scale_color_discrete(labels = c("known boundary", "unknown boundary")) +
  geom_hline(yintercept = 0.5, linetype = "dashed") +
  labs(x = "feedback", y = "mushroom chosen on unknown boundary", title = "sequential lesson 2") +
  facet_grid(known_concept_size ~ unknown_concept_size, labeller = labeller(known_concept_size = known_concept_size.labs, unknown_concept_size = unknown_concept_size.labs)) + 
  theme_few(base_size = 14)
#####
d.wide <- read.csv(here('data/teacher_2d/pilot_2/cleaned_long.csv'))

d.wide.seq <- d.wide %>% filter(sequential == "sequential")
d.wide.nonseq <- d.wide %>% filter(sequential == "non_sequential")

d.wide.nonseq.boundary = d.wide.nonseq %>% filter(boundary_type == "known") %>% 
  group_by(teacher_knowledge) %>% 
  tidyboot_mean(selected_on_boundary, na.rm = TRUE)


mod <- d.nonseq %>% 
  lmer(
    selected_on_boundary ~ 1 + teacher_knowledge * boundary_type + (1 | subject_id) + (1 | concept_size), 
    data = .
  )

summary(mod)

mod <- d.nonseq %>% 
  lmer(
    confidence ~ 1 + teacher_knowledge + (1 | subject_id) + (1 + concept_size), 
    data = .
  )

summary(nonseq.mod)






