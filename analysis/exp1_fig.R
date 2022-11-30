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
  "#be8974",
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


d.data <- read.csv(here("data/exp1_data_cleaned.csv"))
d.model <-
  read.csv(here("model/cleaned_outputs/exp1_simulation_cleaned.csv"))

d.nonseq.means <-
  d.data %>% filter(sequential == "non_sequential") %>%
  group_by(student_prior, teacher_knowledge) %>%
  tidyboot_mean(n_majority / n_turtles, na.rm = T)

fig.nonseq.data <-
  ggplot(d.nonseq.means,
         aes(x = teacher_knowledge, y = empirical_stat, color = student_prior)) +
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
  labs(x = "teacher knowledge",
       y = "turtles sent",
       col = "student prior",
       title = "one-shot (data)")

fig.nonseq.data

# plots for too high

d.seq.toohigh.means <- d.data %>%
  filter(sequential == "sequential", student_prior == "too_high") %>%
  group_by(feedback, trial_num) %>%
  tidyboot_mean(n_majority / n_turtles, na.rm = T)

fig.toohigh.data <-
  ggplot(
    d.seq.toohigh.means,
    aes(
      x = trial_num,
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
  labs(x = "lesson num", y = "turtles sent", title = "too high (data)")


d.seq.toolow.means <- d.data %>%
  filter(sequential == "sequential", student_prior == "too_low") %>%
  group_by(feedback, trial_num) %>%
  tidyboot_mean(n_majority / n_turtles, na.rm = T)

fig.toolow.data <-
  ggplot(
    d.seq.toolow.means,
    aes(
      x = trial_num,
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
  labs(x = "lesson num", y = "turtles sent", title = "too low (data)")

d.model.nonseq <- d.model %>% filter(sequential == "non_sequential")

d.model.nonseq.means <- d.model.nonseq %>%
  group_by(student_prior, teacher_knowledge) %>%
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
  labs(x = "teacher knowledge",
       y = "turtles sent",
       col = "student prior",
       title = "one-shot (model)")

d.model.seq.toohigh.means <- d.model %>%
  filter(sequential == "sequential", student_prior == "too_high") %>%
  group_by(feedback, lesson_num) %>%
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
  labs(x = "lesson num", y = "turtles sent", title = "too high (model)")

fig.toohigh.model

d.model.seq.toolow.means <- d.model %>%
  filter(sequential == "sequential", student_prior == "too_low") %>%
  group_by(feedback, lesson_num) %>%
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
  labs(x = "lesson num", y = "turtles sent", title = "too low (model)")

fig.toolow.model
#####


f1a <-
  ggarrange(
    fig.toohigh.data,
    fig.toolow.data,
    fig.toohigh.model,
    fig.toolow.model,
    labels = c("B", "C", "E", "F"),
    ncol = 2,
    nrow = 2,
    common.legend = TRUE,
    font.label = list(size = 24),
    legend = "bottom"
  )

f1b <-
  ggarrange(
    fig.nonseq.data,
    fig.nonseq.model,
    labels = c("A", "D"),
    ncol = 1,
    nrow = 2,
    common.legend = TRUE,
    font.label = list(size = 24),
    legend = "bottom"
  )

f <- ggarrange(f1b, f1a, widths = c(1, 2))
f 

ggsave(here("writing/exp1.pdf"), plot = f, units = "in", width = 9.5, height = 6)

