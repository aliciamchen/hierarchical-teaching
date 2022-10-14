library(here)
library(tidyverse)
library(tidyboot)
library(ggthemes)
library(lme4)
library(lmerTest)
library(simr)
library(ggpubr)
library(scales)

palette <- c(
  "#c6484d", "#0088ae","#7c5b7f",  "#a3654d", "#7593b6", "#9bb27e", "#e69d45", "#c06c5e", "#f97a3b", "#ba3f5d", "#0063a2", "#4fa091"
)

show_col(palette)

theme_set(theme_few(base_size = 18))

d.data <- read.csv(here("data/exp1_data_cleaned.csv"))
d.model <- read.csv(here("model/cleaned_outputs/exp1_simulation_cleaned.csv"))

d.nonseq.means <- d.data %>% filter(sequential == "non_sequential") %>% 
  group_by(student_prior, teacher_knowledge) %>% 
  tidyboot_mean(
    n_majority / n_turtles, na.rm = T
  )

ggplot(d.nonseq.means, aes(x = teacher_knowledge, y = empirical_stat, color = student_prior)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1.2, width = 0, position = position_dodge(width = 0.1)) + 
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  theme(aspect.ratio = 1) + 
  scale_color_discrete(labels = c("too high", "too low")) +
  scale_color_manual(values = palette) +
  labs(x = "teacher knowledge", y = "proportion majority color", col = "student prior", title = "one-shot teaching (data)") 

nonseq.mod <- lmer_alt(
  n_majority / n_turtles ~ 1 
  + student_prior * teacher_knowledge 
  + (1 + student_prior * teacher_knowledge | subject_id),
  data = d.nonseq,
  control = glmerControl(optimizer = "bobyqa"),
  family = binomial,
  weights = d.nonseq$n_turtles
)

summary(nonseq.mod)

# plots for too high

d.seq.toohigh.means <- d.with.exclusions %>% 
  filter(sequential == "sequential", student_prior == "too_high") %>% 
  group_by(feedback, trial_num) %>% 
  tidyboot_mean(
    n_majority / n_turtles, na.rm = T
  )

ggplot(d.seq.toohigh.means, aes(x = trial_num, y = empirical_stat, color = feedback)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  theme(aspect.ratio = 1) + 
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  scale_color_discrete(labels = c("feedback", "no feedback")) +
  labs(x = "lesson num", y = "proportion majority color", title = "too high (data)")

# plots for too low

d.seq.toolow.means <- d.with.exclusions %>% 
  filter(sequential == "sequential", student_prior == "too_low") %>% 
  group_by(feedback, trial_num) %>% 
  tidyboot_mean(
    n_majority / n_turtles, na.rm = T
  )

ggplot(d.seq.toolow.means, aes(x = trial_num, y = empirical_stat, color = feedback)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  theme(aspect.ratio = 1) + 
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  scale_color_discrete(labels = c("feedback", "no feedback")) +
  labs(x = "lesson num", y = "proportion majority color", title = "too low (data)")

d.toohigh <- d.with.exclusions %>% filter(sequential == "sequential", student_prior == "too_high")

seq.mod.toohigh <- lmer_alt(
  n_majority / n_turtles ~ 1 + trial_num * feedback + (1 + trial_num * feedback | subject_id), 
  data = d.toohigh, 
  weights = d.toohigh$n_turtles,
  family = "binomial",
  control = glmerControl(optimizer = "bobyqa")
)

summary(seq.mod.toohigh)

d.toolow <- d %>% filter(sequential == "sequential", student_prior == "too_low")

seq.mod.toolow <- lmer_alt(
  n_majority / n_turtles ~ 1 + trial_num * feedback + (1 + trial_num * feedback | subject_id), 
  data = d.toolow, 
  weights = d.toolow$n_turtles,
  family = "binomial",
  control = glmerControl(optimizer = "bobyqa")
)

summary(seq.mod.toolow)

nonseq.mod.bayes <- brm(
  n_majority | trials(n_turtles) ~ 1 
  + student_prior * teacher_knowledge 
  + (1 + student_prior * teacher_knowledge | subject_id),
  data = d.nonseq,
  family = binomial
)

summary(nonseq.mod.bayes)

seq.mod.toohigh.bayes <- brm(
  n_majority | trials(n_turtles) ~ 1 + trial_num * feedback + (1 + trial_num * feedback | subject_id),
  data = d.toohigh,
  family = "binomial"
)

summary(seq.mod.toohigh.bayes)

seq.mod.toolow.bayes <- brm(
  n_majority | trials(n_turtles) ~ 1 + trial_num * feedback + (1 + trial_num * feedback | subject_id),
  data = d.toolow,
  family = "binomial"
)

summary(seq.mod.toolow.bayes)

d.model.nonseq <- d.model %>% filter(sequential == "non_sequential")

d.model.nonseq.means <- d.model.nonseq %>% 
  group_by(student_prior, teacher_knowledge) %>% 
  tidyboot_mean(
    n_majority / n_turtles, na.rm = T
  )

d.model.nonseq.means

ggplot(d.model.nonseq.means, aes(x = teacher_knowledge, y = empirical_stat, color = student_prior)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  theme(aspect.ratio = 1) + 
  scale_color_discrete(labels = c("too high", "too low")) +
  labs(x = "teacher knowledge", y = "proportion majority color", col = "student prior", title = "one-shot teaching (model)")

# plots for too high

d.model.seq.toohigh.means <- d.model %>% 
  filter(sequential == "sequential", student_prior == "too_high") %>% 
  group_by(feedback, trial_num) %>% 
  tidyboot_mean(
    n_majority / n_turtles, na.rm = T
  )

ggplot(d.model.seq.toohigh.means, aes(x = trial_num, y = empirical_stat, color = feedback)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  theme(aspect.ratio = 1) + 
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  scale_color_discrete(labels = c("feedback", "no feedback")) +
  labs(x = "lesson num", y = "proportion majority color", title = "too high (model)")

# plots for too low

d.model.seq.toolow.means <- d.model %>% 
  filter(sequential == "sequential", student_prior == "too_low") %>% 
  group_by(feedback, trial_num) %>% 
  tidyboot_mean(
    n_majority / n_turtles, na.rm = T
  )

ggplot(d.model.seq.toolow.means, aes(x = trial_num, y = empirical_stat, color = feedback)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, position = position_dodge(width = 0.1)) + 
  theme(aspect.ratio = 1) + 
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  scale_color_discrete(labels = c("feedback", "no feedback")) +
  labs(x = "lesson num", y = "proportion majority color", title = "too low (model)")
