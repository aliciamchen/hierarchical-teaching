library(here)
library(tidyverse)
library(tidyboot)
library(ggthemes)
library(ggpubr)
library(patchwork)
library(scales)

palette <- c(
  "#c6484d", "#0088ae","#7c5b7f",  "#a3654d", "#7593b6", "#9bb27e", "#e69d45", "#c06c5e", "#f97a3b", "#ba3f5d", "#0063a2", "#4fa091"
)

show_col(palette)

n.ex <- 5
theme_set(theme_few(base_size = 16))

d.data <- read.csv(here("data/exp2_data_cleaned.csv"))
d.model <- read.csv(here("model/cleaned_outputs/exp2_simulation_cleaned.csv"))



fig.data <- ggplot(
  data = d.data %>%
    group_by(first_examples_a) %>%
    tidyboot_mean(guess, na.rm = TRUE),
  aes(x = first_examples_a, y = empirical_stat)
) +
  geom_point(size = 4, col = "#0063a2") +
  geom_errorbar(aes(ymin = ci_lower, ymax = ci_upper),
                size = 2,
                width = 0, col = "#0063a2") +
  geom_vline(xintercept = 0.9 * 5,
             linetype = "dashed") +
  labs(x = "# turtles in majority color of student prior", y = "yes", title = "data")


fig.model <- ggplot(
  data = d.model %>% filter(student_a == 9, speaker_alpha == 4, listener_alpha == 4, guess_cost == 0.1), aes(x = first_examples_a, y = guess)
) + 
  geom_point(size = 4, col = "#0063a2") +
  geom_vline(xintercept = 0.9 * 5,
             linetype = "dashed") +
  labs(x = "# turtles in majority color of student prior", y = "yes", title = "model")


f <- ggarrange(fig.data, fig.model, labels = c("A", "B"), ncol = 1, nrow = 2)

f1 <- (fig.data / fig.model) 
# + plot_annotation(
  # title = "does the student send a guess?",
  # theme = theme(plot.title = element_text(size = 18))
# )

f1

ggsave(here("writing/exp2.pdf"), plot = f1, units = "in", width = 6.6, height = 5)

