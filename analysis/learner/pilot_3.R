library(here)
library(tidyverse)
library(tidyboot)
library(ggthemes)
library(lme4)
library(lmerTest)
library(simr)

d.raw <- read.csv(here("data/learner/pilot_3a/pilot_3a_data.csv"))
theme_set(theme_few(base_size = 15))

n.ex.teacher <- 5 

d <- d.raw %>% 
  filter(n_attention_passed == 2, trial_num == 0) %>% 
  mutate(
    examples_a = ifelse(student_a == 9, first_examples_a, 5 - first_examples_a), 
    examples_b = ifelse(student_a == 9, first_examples_b, 5 - first_examples_b), 
    first_guess = ifelse(student_a == 9, first_guess / 100, (100 - first_guess) / 100),
    feedback = ifelse(feedback_choice == "yes", TRUE, FALSE), 
    teacher_knowledge = teacher_knowledge / 100
  ) %>% 
  select(c(subject_id, island_idx, trial_num, block_type, examples_a, examples_b, teacher_knowledge, feedback, first_guess))

print(length(unique(d$subject_id)))

d.model <- read.csv(here("data/learner/model/v6.csv")) %>% 
  mutate(
    examples_a = ifelse(student_a == 9, first_examples_a, n.ex.teacher - first_examples_a), 
    examples_b = ifelse(student_a == 9, first_examples_b, n.ex.teacher - first_examples_b), 
    first_guess = ifelse(student_a == 9, first_guess / 100, (100 - first_guess) / 100),
    feedback = feedback_choice / 100, 
    teacher_knowledge = teacher_knowledge / 100
  ) %>% 
  select(c(block_type, examples_a, examples_b, teacher_knowledge, feedback, first_guess))

###
line.data <- data.frame(xintercept = c(0.9 * n.ex.teacher, 0,  0.3 * n.ex.teacher, 0.7 * n.ex.teacher, n.ex.teacher), lines = c("what student saw (9 heads, 1 tail)", "possible true concept", "possible true concept", "possible true concept", "possible true concept"))
ggplot(data = d.model, aes(x = examples_a, y = teacher_knowledge)) +
  geom_point(size = 2) +
  geom_vline(aes(xintercept = xintercept, color = lines), data = line.data, linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5 examples)", y = "rating", title = "\"do you think your teacher knows what you have seen?\" model")


###

d.means <- d %>% 
  group_by(examples_a, examples_b) %>% 
  tidyboot_mean(teacher_knowledge, na.rm = TRUE)

line.data <- data.frame(xintercept = c(0.9 * n.ex.teacher, 0.3 * n.ex.teacher, 0.7 * n.ex.teacher), lines = c("what student saw (9 heads, 1 tail)", "possible true concept", "possible true concept"))
ggplot(data = d.means, aes(x = examples_a, y = empirical_stat)) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0) +
  geom_point(data = d.model, aes(x = examples_a, y = teacher_knowledge, color = "model")) +
  geom_vline(aes(xintercept = xintercept, color = lines), data = line.data, linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5 examples)", y = "rating", title = "\"do you think your teacher knows what you have seen?\"")

###

d.means <- d %>% 
  group_by(examples_a, examples_b) %>% 
  tidyboot_mean(feedback, na.rm = TRUE)

ggplot(data = d.means, aes(x = examples_a, y = empirical_stat)) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0) +
  geom_point(data = d.model, aes(x = examples_a, y = feedback, color = "model")) +
  geom_vline(aes(xintercept = xintercept, color = lines), data = line.data, linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5 examples)", y = "rating", title = "\"would you like to send your teacher a guess?\"")

###

d.guess <- d %>% 
  group_by(examples_a, examples_b) %>% 
  tidyboot_mean(first_guess, na.rm = TRUE)

ggplot(data = d.guess, aes(x = examples_a, y = empirical_stat)) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0) +
  geom_point(data = d.model, aes(x = examples_a, y = first_guess, color = "model")) +
  geom_vline(aes(xintercept = xintercept, color = lines), data = line.data, linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5 examples)", y = "rating for (7 heads, 3 tails)", title = "Guess for island composition")

###

mod <- glmer(
  feedback ~ 1 + examples_a + (1 + examples_a | subject_id),
  data = d,
  family = binomial,
  control = glmerControl(optimizer = "bobyqa"),
)

summary(mod)

powerSim(mod, test = fixed("examples_a"), nsim = 50)
  
mod1 <- extend(mod, along="subject_id", n=150)
powerSim(mod1, test = fixed("examples_a"), nsim = 100)

pwrplot <- powerCurve(mod1, test = fixed("examples_a"), along = "subject_id", nsim = 30)
plot(pwrplot)
