library(here)
library(tidyverse)
library(ggthemes)

theme_set(theme_few(base_size = 15))

n.ex.teacher = 5

# 0.01 and 0.99

d.model <- read.csv(here("model/learner/output/combined_0.01_0.99_new.csv")) %>% 
  filter(student_a == 9) %>% 
  mutate(
    examples_a = ifelse(student_a == 9, first_examples_a, n.ex.teacher - first_examples_a), 
    examples_b = ifelse(student_a == 9, first_examples_b, n.ex.teacher - first_examples_b), 
    theta = ifelse(student_a == 9, theta, 1 - theta) 
  ) %>% 
  rename(feedback = feedback_choice) %>% 
  select(c(speaker_alpha, listener_alpha, guess_cost, theta, student_a, student_b, examples_a, examples_b, teacher_knowledge, feedback, first_guess))

ggplot(data = d.model %>% filter(guess_cost == 0), aes(x = examples_a, y = teacher_knowledge)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_wrap(~speaker_alpha, ncol = length(unique(d.model$speaker_alpha)), labeller = labeller(.rows = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "P(yes)", title = "\"do you think your teacher knows what you have seen?\" [0.01, 0.3, 0.7, 0.99]")

ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = feedback)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_grid(alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "P(send guess)", title = "\"would you like to send your teacher a guess?\" [0.01, 0.3, 0.7, 0.99]")

ggplot(data = d.model %>% filter(theta == 0.3, student_a == 9), aes(x = examples_a, y = feedback, col = listener_alpha, group = listener_alpha)) +
  geom_point(size = 2) +
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(1, 2, 4, 8, 16)) +
  facet_grid(speaker_alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "P(send guess)", title = "\"would you like to send your teacher a guess?\" [0.01, 0.3, 0.7, 0.99]")

ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha, guess_cost == 0) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = first_guess, col = theta, group = theta)) + 
  geom_point(size = 2, alpha = 0.7) + 
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(0.01, 0.3, 0.7, 0.99)) +
  facet_wrap(~alpha, ncol = 1, labeller = labeller(.rows = label_both)) + 
  labs(x = "# heads from teacher", y = "P(correct guess)", title = "Guesses [0.01, 0.3, 0.7, 0.99]")


# 0.1 and 0.9

d.model <- read.csv(here("model/learner/output/combined_0.1_0.9_new.csv")) %>% 
  filter(student_a == 9) %>% 
  mutate(
    examples_a = ifelse(student_a == 9, first_examples_a, n.ex.teacher - first_examples_a), 
    examples_b = ifelse(student_a == 9, first_examples_b, n.ex.teacher - first_examples_b), 
    theta = ifelse(student_a == 9, theta, 1 - theta) 
  ) %>% 
  rename(feedback = feedback_choice) %>% 
  select(c(speaker_alpha, listener_alpha, guess_cost, theta, student_a, student_b, examples_a, examples_b, teacher_knowledge, feedback, first_guess))

ggplot(data = d.model %>% filter(guess_cost == 0), aes(x = examples_a, y = teacher_knowledge)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_wrap(~speaker_alpha, ncol = length(unique(d.model$speaker_alpha)), labeller = labeller(.rows = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "P(yes)", title = "\"do you think your teacher knows what you have seen?\" [0.1, 0.3, 0.7, 0.9]")

ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = feedback)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_grid(alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "P(send guess)", title = "\"would you like to send your teacher a guess?\" [0.1, 0.3, 0.7, 0.9]")

ggplot(data = d.model %>% filter(theta == 0.3, student_a == 9), aes(x = examples_a, y = feedback, col = listener_alpha, group = listener_alpha)) +
  geom_point(size = 2) +
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(1, 2, 4, 8, 16)) +
  facet_grid(speaker_alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "P(send guess)", title = "\"would you like to send your teacher a guess?\" [0.1, 0.3, 0.7, 0.9]")

ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha, guess_cost == 0) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = first_guess, col = theta, group = theta)) + 
  geom_point(size = 2, alpha = 0.7) + 
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(0.1, 0.3, 0.7, 0.9)) +
  facet_wrap(~alpha, ncol = 1, labeller = labeller(.rows = label_both)) + 
  labs(x = "# heads from teacher", y = "P(correct guess)", title = "Guesses [0.1, 0.3, 0.7, 0.9]")
