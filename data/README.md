# Codebook

## Experiment 1: `exp1_data_cleaned.csv`

### Independent measures

- `subject_id`: anonymized subject ID
- `trial_num`: trial index (0 through 15; each participant does 16 trials)
- `lesson_num`: lesson index (either `lesson1` or `lesson2`)
- `sequential`: are there one or two lessons? if `sequential`, then there are two lessons
- `feedback`: does the participant receive feedback from the learner after the first lesson?
- `teacher_knowledge`: how much does the teacher know about the student?
- `student_prior`: has the learner seen 9 out of 10 turtles in the majority color of turtles on the island (`too_high`) or 1 out of 10 turtles in the majority color of turtles on the island (`too_low`)

### Dependent measures

- `n_majority`: number of turtles teacher sent in the majority color of turtles on the island
- `n_turtles`: total number of turtles teacher sent

## Experiment 2: `exp2_data_cleaned.csv`

### Independent measures

- `subject_id`: anonymized subject ID
- `island_idx`: trial index (0 through 11, each participant does 12 trials)
- `teacher_knowledge`: how much does the teacher know about the student?
- `theta`: true island proportion
- `student_a` and `student_b`: refer to the student's priors. all 9 and 1 respectively, because we collapsed all responses to the majority color in students' priors
- `first_examples_a`: number of first-lesson turtles received from teacher in majority color of student prior
- `first_examples_b`: number of first-lesson turtles received from teacher in minority color of student prior
- `second_examples_a`: number of second-lesson turtles received from teacher in majority color of student prior (this varies based on participant's first guess)
- `second_examples_b`: number of second-lesson turtles received from teacher in minority color of student prior (this varies based on participant's first guess)

### Dependent measures

- `guess`: did the participant provide a guess? `1` if yes, `0` if no
- `first_guess`: participant's first guess for true island proportion
- `final_guess`: participant's final guess for true island proportion