library(here)
library(tidyverse)
library(tidyboot)
library(ggthemes)
library(ggpubr)
library(scales)

theme_set(theme_few(base_size = 14.5))

palette <- c(
  "#cc494e",
  "#0096bf",
  "#a4d964",
  "#fcbe42",
  "#aa4fff",
  "#fc8e7c",
  "#fa9820",
  "#7593b6",
  "#f97a3b",
  "#ba3f5d",
  "#0063a2",
  "#4fa091"
)

show_col(palette)


## Experiment 1

d.model <-
  read.csv(here("model/cleaned_outputs/exp1_simulation_cleaned.csv"))

d.model.nonseq <- d.model %>% filter(sequential == "non_sequential")

d.model.nonseq.means <- d.model.nonseq %>%
  group_by(alpha, student_prior, teacher_knowledge) %>%
  tidyboot_mean(n_majority / n_turtles, na.rm = T)


fig.nonseq.model <-
  ggplot(
    d.model.nonseq.means,
    aes(x = teacher_knowledge, y = empirical_stat, color = student_prior)
  ) +
  geom_point(size = 3.5, position = position_dodge(width = 0.15)) +
  geom_errorbar(
    aes(ymin = ci_lower, ymax = ci_upper),
    size = 1.6,
    width = 0,
    position = position_dodge(width = 0.15)
  ) +
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  theme(aspect.ratio = 1) +
  scale_color_manual(values = palette[1:2], labels = c("too high", "too low")) +
  facet_grid(~ alpha, labeller = label_parsed) +
  labs(x = "teacher knowledge",
       y = "turtles sent",
       col = "student prior",
       title = "one-shot (model)")

fig.nonseq.model

ggsave(
  here("writing/outputs/supp_exp1_nonseq.pdf"),
  plot = fig.nonseq.model,
  units = "in",
  width = 12,
  height = 5
)


d.model.seq.toohigh.means <- d.model %>%
  filter(sequential == "sequential", student_prior == "too_high") %>%
  group_by(alpha, feedback, lesson_num) %>%
  tidyboot_mean(n_majority / n_turtles, na.rm = T)

fig.toohigh.model <-
  ggplot(
    d.model.seq.toohigh.means,
    aes(
      x = lesson_num,
      y = empirical_stat,
      color = feedback,
      group = feedback
    )
  ) +
  geom_point(size = 3.5, position = position_dodge(width = 0.15)) +
  geom_path(size = 1.2, position = position_dodge(width = 0.15)) +
  geom_errorbar(
    aes(ymin = ci_lower, ymax = ci_upper),
    size = 1.6,
    width = 0,
    position = position_dodge(width = 0.15)
  ) +
  theme(aspect.ratio = 1) +
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  scale_x_discrete(name = "lesson", labels = c("first", "second")) +
  scale_color_manual(values = palette[3:4], labels = c("yes", "no")) +
  facet_grid(~ alpha, labeller = label_parsed) +
  labs(x = "lesson num", y = "turtles sent", title = "too high (model)")

fig.toohigh.model


ggsave(
  here("writing/outputs/supp_exp1_toohigh.pdf"),
  plot = fig.toohigh.model,
  units = "in",
  width = 12,
  height = 5
)



d.model.seq.toolow.means <- d.model %>%
  filter(sequential == "sequential", student_prior == "too_low") %>%
  group_by(alpha, feedback, lesson_num) %>%
  tidyboot_mean(n_majority / n_turtles, na.rm = T)

fig.toolow.model <-
  ggplot(
    d.model.seq.toolow.means,
    aes(
      x = lesson_num,
      y = empirical_stat,
      color = feedback,
      group = feedback
    )
  ) +
  geom_point(size = 3.5, position = position_dodge(width = 0.15)) +
  geom_path(size = 1.2, position = position_dodge(width = 0.15)) +
  geom_errorbar(
    aes(ymin = ci_lower, ymax = ci_upper),
    size = 1.6,
    width = 0,
    position = position_dodge(width = 0.15)
  ) +
  theme(aspect.ratio = 1) +
  geom_hline(yintercept = 0.7, linetype = "dashed") +
  scale_x_discrete(name = "lesson", labels = c("first", "second")) +
  scale_color_manual(values = palette[3:4], labels = c("yes", "no")) +
  facet_grid(~ alpha, labeller = label_parsed) +
  labs(x = "lesson num", y = "turtles sent", title = "too low (model)")

fig.toolow.model

ggsave(
  here("writing/outputs/supp_exp1_toolow.pdf"),
  plot = fig.toolow.model,
  units = "in",
  width = 12,
  height = 5
)



## Experiment 2

d <- read.csv(here("data/exp2_data_cleaned.csv"))
d.model <-
  read.csv(here("model/cleaned_outputs/exp2_simulation_cleaned.csv"))

# when participants give a guess, what do they guess?

guess.data <-
  ggplot(
    data = d %>% mutate(correct_guess = first_guess == theta) %>%
      group_by(theta, first_examples_a) %>%
      tidyboot_mean(correct_guess, na.rm = TRUE)
    ,
    aes(
      x = first_examples_a,
      y = empirical_stat,
      col = theta,
      group = theta
    )
  ) +
  geom_point(size = 3, alpha = 0.7) +
  geom_path(size = 2, alpha = 0.7) +
  geom_errorbar(
    aes(ymin = ci_lower, ymax = ci_upper),
    size = 1.8,
    width = 0,
    alpha = 0.7
  ) +
  scale_color_viridis_c(guide = "legend", breaks = c(0.3, 0.7)) +
  ylim(0, 1) +
  geom_vline(xintercept = 0.9 * 5,
             col = "blue",
             linetype = "dashed") +
  labs(x = "# turtles in majority color of student prior",
       y = "probability of correct first guess",
       col = "true proportion",
       title = "data")

guess.data

guess.model <-
  ggplot(
    data = d.model %>% filter(
      student_a == 9,
      speaker_alpha == 4,
      listener_alpha == 4,
      guess_cost == 0.1
    ),
    aes(
      x = first_examples_a,
      y = first_guess,
      col = theta,
      group = theta
    )
  ) +
  geom_point(size = 3, alpha = 0.7) +
  geom_path(size = 2, alpha = 0.7) +
  ylim(0, 1) +
  geom_vline(xintercept = 0.9 * 5,
             color = 'blue',
             linetype = "dashed") +
  scale_color_viridis_c(guide = "legend", breaks = c(0.1, 0.3, 0.7, 0.9)) +
  labs(x = "# turtles in majority color of student prior",
       y = "probability of correct first guess",
       col = "true proportion",
       title = "model")

guess.model

fig.supp.guesses <-
  ggarrange(
    guess.data,
    guess.model,
    ncol = 2,
    common.legend = TRUE,
    legend = "bottom"
  )

fig.supp.guesses

ggsave(
  here("writing/outputs/supp_guesses.pdf"),
  plot = fig.supp.guesses,
  units = "in",
  width = 12,
  height = 5
)

## model at multiple parameter levels

fig.exp2.params <-
  ggplot(
    data = d.model %>% filter(speaker_alpha == listener_alpha) %>% rename(alpha = speaker_alpha) %>% filter(theta == 0.3, student_a == 9, alpha != 3),
    aes(x = first_examples_a, y = guess)
  ) +
  geom_point(size = 2) +
  geom_vline(xintercept = 0.9 * 5,
             color = 'blue',
             linetype = "dashed") +
  facet_grid(alpha ~ guess_cost, labeller = label_parsed) +
  labs(x = "# turtles in majority color of student prior", y = "proportion sending a guess")

fig.exp2.params

ggsave(
  here("writing/outputs/supp_exp2_model_params.pdf"),
  plot = fig.exp2.params,
  units = "in",
  width = 10,
  height = 6
)


fig.exp2.allparams <-
  ggplot(
    data = d.model %>% filter(theta == 0.3, student_a == 9, speaker_alpha != 3),
    aes(
      x = first_examples_a,
      y = guess,
      col = listener_alpha,
      group = listener_alpha
    )
  ) +
  geom_point(size = 2) +
  geom_path(size = 1, alpha = 0.7) +
  geom_vline(xintercept = 0.9 * 5,
             color = 'blue',
             linetype = "dashed") +
  scale_color_viridis_c(guide = "legend", breaks = c(1, 2, 4, 8, 16)) +
  facet_grid(speaker_alpha ~ guess_cost, labeller = label_parsed) +
  labs(x = "# turtles in majority color of student prior", y = "proportion sending a guess")


fig.exp2.allparams

ggsave(
  here("writing/outputs/supp_exp2_model_params_all.pdf"),
  plot = fig.exp2.allparams,
  units = "in",
  width = 10,
  height = 6
)
