library(here)
library(tidyverse)
library(tidyboot)
library(ggthemes)
library(lme4)
library(lmerTest)
library(simr)
library(ggpubr)
library(rgl)
library(factoextra)

d.raw <- read.csv(here("data/learner/pilot_6/pilot_6_data.csv"))
theme_set(theme_few(base_size = 15))


d <- d.raw %>%
  filter(n_attention_passed == 2, is.finite(first_examples_a) == TRUE) %>%
  mutate(
    first_examples_a = ifelse(student_a == 9, first_examples_a, 5 - first_examples_a),
    first_examples_b = ifelse(student_a == 9, first_examples_b, 5 - first_examples_b),
    theta = ifelse(student_a == 9, round(theta, 1), round(1 - theta, 1)),
    first_guess = ifelse(student_a == 9, round(first_guess, 1), round(1 - first_guess, 1)),
    guess = ifelse(feedback_choice == 'yes', TRUE, FALSE),
    teacher_knowledge = teacher_knowledge / 100
  ) %>%
  group_by(subject_id, island_idx, block_type, theta) %>%
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
  mutate(
    first_guess = ifelse(guess == 1, first_guess, NA)
  )

n.ex <- max(d$first_examples_a)
print(length(unique(d$subject_id)))

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

### Does the student send a guess?

d.per.participant <- d %>% 
  group_by(subject_id, first_examples_a) %>% 
  summarize(p = mean(guess))

ggplot(
  data = d %>%
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
  labs(x = "# heads from teacher (out of 5)", y = "yes", title = "\"would you like to send your teacher a guess?\"")




ggplot(
  data = d, aes(x = first_examples_a, y = guess)
) + 
  geom_jitter(size = 2, height = 0.04, alpha = 0.2) + 
  geom_smooth(method = "glm", method.args = list(family = "binomial")) +
  scale_y_continuous(breaks = c(0, 1), labels = c("no", "yes"))  


mod <- glmer(
  guess ~ 1 + first_examples_a + (1 + first_examples_a | subject_id),
  data = d,
  family = binomial,
  control = glmerControl(optimizer = "bobyqa"),
)

summary(mod)

### Relationship between rating of teacher knowledge and guess decision

ggplot(data = d, aes(x = teacher_knowledge, y = guess)) + 
  geom_jitter(height = 0.03, alpha = 0.15) + 
  geom_smooth(method = "glm", method.args = list(family = "binomial")) + 
  scale_y_continuous(breaks = c(0, 1), labels = c("no", "yes")) + 
  labs(x = "rating of teacher knowledge", title = "teacher knowledge eval vs. guess decision")

mod <-
  glmer(
    guess ~ 1 + first_examples_a + (1 + first_examples_a | subject_id),
    data = d,
    family = "binomial"
  )

summary(mod)

# when participants give a guess, what do they guess? 

d.guess <- d %>%
  mutate(correct_guess = first_guess == theta) %>%
  group_by(theta, first_examples_a) %>%
  summarize(mean = mean(correct_guess, na.rm = TRUE),
            sd = sd(correct_guess, na.rm = TRUE),
            se = sd / sqrt(n()),
            CI_lower = mean - (1.96 * se),
            CI_upper = mean + (1.96 * se))

ggplot(data = d.guess, aes(
  x = first_examples_a,
  y = mean,
  col = theta,
  group = theta
)) +
  geom_point(size = 2, alpha = 0.7) +
  geom_path(size = 1, alpha = 0.7) + 
  geom_errorbar(aes(ymin = CI_lower, ymax = CI_upper), size = 1, width = 0, alpha = 0.7) + 
  scale_color_viridis_c(guide = "legend", breaks = c(0.1, 0.3, 0.7, 0.9)) +
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
  scale_x_discrete(labels = c("no", "yes")) +
  labs(x = "sent first guess?", y = "correct final guess", title = "final guess")

# Are final guesses better than first guesses? They should be better only in the partial case
# TODO: finish plotting this

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

### Power analysis

mod <-
  glmer(
    feedback ~ 1 + teacher_knowledge + (1 + teacher_knowledge |
                                          subject_id),
    data = d,
    family = 'binomial'
  )

summary(mod)




mod <- glmer(
  feedback ~ 1 + examples_a + (1 + examples_a | subject_id),
  data = d,
  family = binomial,
  control = glmerControl(optimizer = "bobyqa"),
)

summary(mod)

powerSim(mod, test = fixed("examples_a"), nsim = 50)

mod1 <- extend(mod, along = "subject_id", n = 70)
powerSim(mod1, test = fixed("examples_a"), nsim = 100)

pwrplot <-
  powerCurve(mod1,
             test = fixed("examples_a"),
             along = "subject_id",
             nsim = 30)
plot(pwrplot)
