library(here)
library(tidyverse)
library(tidyboot)
library(ggthemes)
library(lme4)
library(lmerTest)
library(simr)
library(ggpubr)
library(scales)

d <- read.csv(here("data/exp2_data_cleaned.csv"))
d.model <- read.csv(here("model/cleaned_outputs/exp2_simulation_cleaned.csv"))

### Rating of teacher knowledge

ggplot(
  data = d %>%
    group_by(first_examples_a, first_examples_b) %>%
    tidyboot_mean(teacher_knowledge, na.rm = TRUE),
  aes(x = first_examples_a, y = empirical_stat)
) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper),
                size = 1,
                width = 0) +
  geom_vline(xintercept = 0.9 * n.ex,
             col = "blue",
             linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5)", y = "yes", title = "\"do you think your teacher knows what you have seen?\"")



### Relationship between rating of teacher knowledge and guess decision

ggplot(data = d, aes(x = teacher_knowledge, y = guess)) + 
  geom_jitter(height = 0.03, alpha = 0.15) + 
  geom_smooth(method = "glm", method.args = list(family = "binomial")) + 
  scale_y_continuous(breaks = c(0, 1), labels = c("no", "yes")) + 
  labs(x = "rating of teacher knowledge", title = "teacher knowledge eval vs. guess decision")


# when participants give a guess, what do they guess? 

ggplot(data = d %>% mutate(correct_guess = first_guess == theta) %>% 
         group_by(theta, first_examples_a) %>% 
         tidyboot_mean(correct_guess, na.rm = TRUE)
       , aes(
         x = first_examples_a,
         y = empirical_stat,
         col = theta,
         group = theta
       )) +
  geom_point(size = 2, alpha = 0.7) +
  geom_path(size = 1, alpha = 0.7) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1, width = 0, alpha = 0.7) + 
  scale_color_viridis_c(guide = "legend", breaks = c(0.3, 0.7)) +
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5)", y = "correct first guess", title = "do participants provide correct guesses?")


ggplot(data = d, aes(x = first_examples_a, y = first_guess, theta)) + 
  geom_jitter(size = 2, height = 0.03, alpha = 0.4) + 
  # geom_smooth(method = "lm") + 
  scale_y_continuous(breaks = c(0.1, 0.3, 0.7, 0.9)) + 
  scale_x_continuous(breaks = c(0, 1, 2, 3, 4, 5)) + 
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  labs(x = "# heads from teacher (out of 5)", y = "first guess", title = "what do participants guess?")


# does providing a guess help participants do better? 

d.final.guess <- d %>% 
  mutate(correct_guess = final_guess == theta) %>% 
  group_by(block_type, guess) %>% 
  tidyboot_mean(correct_guess)

ggplot(data = d.final.guess, aes(x = factor(guess), y = empirical_stat, col = block_type)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1.2, width = 0, position = position_dodge(width = 0.1))  +
  geom_hline(yintercept = 0.5, color = "blue", linetype = "dashed") +
  scale_x_discrete(labels = c("no", "yes")) +
  labs(x = "sent first guess?", y = "correct final guess", title = "final guess")

# Are final guesses better than first guesses? They should be better only in the partial case
# TODO: finish plotting this

d.guesses <- d %>% 
  mutate(correct_first_guess = first_guess == theta, 
         correct_final_guess = final_guess == theta) %>% 
  pivot_longer(cols = starts_with("correct"), 
               names_prefix = "correct_",
               names_to = "stage", 
               values_to = "correct") 

d.guesses.means <- d.guesses %>% 
  group_by(block_type, stage) %>% 
  tidyboot_mean(correct, na.rm = T)

ggplot(data = d.guesses.means, aes(x = stage, y = empirical_stat, col = block_type)) + 
  geom_point(size = 3, position = position_dodge(width = 0.1)) + 
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper), size = 1.2, width = 0, position = position_dodge(width = 0.1))  +
  geom_hline(yintercept = 0.5, color = "blue", linetype = "dashed") +
  scale_x_discrete(limits = c("first_guess", "final_guess"), labels = c("first_guess" = "first", "final_guess" = "final")) +
  labs(x = "guess stage", y = "correct guess", title = "improvement from first to final guess")
# d.first.guess <- d %>% 
#   filter(guess == 1) %>% 
#   mutate(correct_guess = first_guess == theta, na.rm = TRUE) %>% 
#   group_by(block_type) %>% 
#   tidyboot_mean(correct_guess, na.rm = TRUE)


### 2d projection of participants
d.cluster <- d %>%
  group_by(subject_id, first_examples_a) %>% 
  summarize(guess = mean(guess)) %>% 
  pivot_wider(names_from = first_examples_a, values_from = guess) %>% 
  ungroup()

mds <- d.cluster %>% 
  dist() %>% 
  cmdscale(k = 3) %>% 
  as_tibble()

colnames(mds) <- c("mds_1", "mds_2", "mds_3")

ggscatter(mds, x = "mds_1", y = "mds_2", label = rownames(d.cluster), size = 1, alpha = 0.3)

options(rgl.printRglwidget = TRUE)

plot3d( 
  x=mds$mds_1, y=mds$mds_2, z=mds$mds_3, 
  type = 's', 
  radius = .05,
  xlab="D1", ylab="D2", zlab="D3")

# k means
km <- kmeans(d.cluster %>% select(-subject_id), centers = 2, nstart = 20)
fviz_cluster(km, data = d.cluster %>% select(-subject_id))

d.cluster$cluster <- km$cluster

d.new <- right_join(d, d.cluster %>% select(c(subject_id, cluster)), by = "subject_id")

# Plot results separately based on cluster

ggplot(
  data = d.new %>%
    filter(cluster == 1) %>% 
    group_by(first_examples_a) %>%
    tidyboot_mean(guess, na.rm = TRUE),
  aes(x = first_examples_a, y = empirical_stat)
) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper),
                size = 1,
                width = 0) +
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  ylim(0, 1) + 
  labs(x = "# heads from teacher (out of 5)", y = "yes", title = "\"would you like to send your teacher a guess?\" cluster 1") 


ggplot(
  data = d.new %>%
    filter(cluster == 2) %>% 
    group_by(first_examples_a) %>%
    tidyboot_mean(guess, na.rm = TRUE),
  aes(x = first_examples_a, y = empirical_stat)
) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper),
                size = 1,
                width = 0) +
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  ylim(0, 1) +
  labs(x = "# heads from teacher (out of 5)", y = "yes", title = "\"would you like to send your teacher a guess?\" cluster 2")



ggplot(
  data = d %>%
    group_by(first_examples_a) %>%
    tidyboot_mean(guess, na.rm = TRUE),
  aes(x = first_examples_a, y = empirical_stat)
) +
  geom_point(size = 2) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper),
                size = 1,
                width = 0) +
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  ylim(0, 1) +
  labs(x = "# heads from teacher (out of 5)", y = "yes", title = "\"would you like to send your teacher a guess?\" all")

d.per.participant <- d.data %>% 
  group_by(subject_id, first_examples_a) %>% 
  summarize(p = mean(guess))

ggplot(
  data = d.data %>%
    group_by(first_examples_a) %>%
    tidyboot_mean(guess, na.rm = TRUE),
  aes(x = first_examples_a, y = empirical_stat)
) +
  geom_point(size = 2) +
  geom_path(data = d.per.participant, aes(x = first_examples_a, y = p, group = subject_id), position = position_jitter(width = 0.07, height = 0.07, seed = 123), alpha = 0.07) +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper),
                size = 1,
                width = 0) +
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  scale_y_continuous(breaks = c(0, 1), labels = c("no", "yes"))  +
  labs(x = "# heads from teacher (out of 5)", y = "guess", title = "\"would you like to send your teacher a guess?\"")

ggplot(
  data = d.data, aes(x = first_examples_a, y = guess)
) + 
  geom_jitter(size = 2, height = 0.04, alpha = 0.1) + 
  geom_smooth(method = "glm", method.args = list(family = "binomial")) +
  scale_y_continuous(breaks = c(0, 1), labels = c("no", "yes"))  +
  labs(x = "# heads from teacher (out of 5)", title = "\"would you like to send your teacher a guess?\"")

## model


ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = feedback)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_grid(alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "send guess", title = "\"would you like to send your teacher a guess?\" [0.3, 0.7]")

ggplot(data = d.model %>% filter(theta == 0.3), aes(x = examples_a, y = feedback, col = listener_alpha, group = listener_alpha)) +
  geom_point(size = 2) +
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(1, 2, 4, 8, 16)) +
  facet_grid(speaker_alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "send guess", title = "\"would you like to send your teacher a guess?\" [0.3, 0.7]")


ggplot(data = d.model %>% filter(guess_cost == 0), aes(x = examples_a, y = teacher_knowledge)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_wrap(~speaker_alpha, ncol = length(unique(d.model$speaker_alpha)), labeller = labeller(.rows = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "yes", title = "\"do you think your teacher knows what you have seen?\" [0.3, 0.7]")



ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha, guess_cost == 0) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = first_guess, col = theta, group = theta)) + 
  geom_point(size = 2, alpha = 0.7) + 
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(0.1, 0.3, 0.7, 0.9)) +
  facet_wrap(~alpha, ncol = 1, labeller = labeller(.rows = label_both)) + 
  labs(x = "# heads from teacher", y = "correct guess", title = "Guesses [0.3, 0.7]")

## Model


ggplot(data = d.model %>% filter(speaker_alpha == listener_alpha) %>% rename(alpha = speaker_alpha), aes(x = examples_a, y = feedback)) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  facet_grid(alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "send guess", title = "\"would you like to send your teacher a guess?\" [0.3, 0.7]")

ggplot(data = d.model %>% filter(theta == 0.3), aes(x = examples_a, y = feedback, col = listener_alpha, group = listener_alpha)) +
  geom_point(size = 2) +
  geom_path(size = 1, alpha = 0.7) + 
  geom_vline(xintercept = 0.9 * 5, color = 'blue', linetype = "dashed") + 
  scale_color_viridis_c(guide = "legend", breaks = c(1, 2, 4, 8, 16)) +
  facet_grid(speaker_alpha ~ guess_cost, labeller = labeller(.rows = label_both, .cols = label_both)) + 
  labs(x = "# heads from teacher (out of 5 examples)", y = "send guess", title = "\"would you like to send your teacher a guess?\" [0.3, 0.7]")
