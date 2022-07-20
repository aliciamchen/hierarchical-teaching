function comprehensionCheck(instructionsParams) {
    return {
        type: jsPsychSurveyMultiChoice,
        questions: [
            {
                prompt: `What are the differences between different students' past island experience?`,
                options: [
                    'Students will have seen a different number of orange and purple turtles from the island before seeing the new turtles you show them.',
                    'Students will have seen a bunch of different types of islands before seeing the new turtles you show them.',
                    `All students' experience is the same, so I will treat all students the same.`
                ],
                required: true
            },
            {
                prompt: 'How can you earn a high performance bonus?',
                options: [
                    'By showing my students as few turtles as possible.',
                    `By not considering what my students have already seen on the island, and instead showing my students ${instructionsParams.maxExamples} turtles (the maximum) on each lesson so I can make sure that the students' guesses are as accurate as possible.`,
                    `By considering what my students have already seen on the island so that I can correct their assumptions about the island and teach efficiently and accurately/helpfully at the same time.`
                ],
                required: true
            },
            {
                prompt: `Is there a chance you'll encounter the same student twice (not including the students you'll teach over two lessons)?`,
                options: [
                    'Yes, I might encounter the same student twice.',
                    'No, I will teach a <b>new</b> student each time.'
                ],
                required: true
            },
            {
                prompt: `For the students to whom I'll show two sets of turtles (over two lessons), how will my bonus be calculated?`,
                options: [
                    `Based on the student's first guess.`,
                    `Based on the student's second (and final) guess.`,
                    'Based on both guesses.'
                ],
                required: true
            },
            {
                prompt: `How will new turtles be shown to my students?`,
                options: [
                    'The students will be walked around the island until they see the number of new orange and purple turtles I select for them.',
                    'The new turtles will be shown to the student as a random sample from the island.',
                    'The new turtles will appear out of thin air.'
                ],
                required: true
            }
        ],
        randomize_question_order: true,

        on_finish: function (data) {
            data.pass = [data.response.Q0.includes('orange'), data.response.Q1.includes('time'), data.response.Q2.includes('new'), data.response.Q3.includes('final'), data.response.Q4.includes('walked')].every(Boolean)
        }
    }
}


function failComprehensionCheck(jsPsych) {
    return {
        timeline: [{
            type: jsPsychHtmlButtonResponse,
            stimulus: `Oops, you have missed question(s) on the comprehension check! We'll show you the instructions again.`,
            choices: ["Got it!"]
        }],
        conditional_function: function () {
            const responses = jsPsych.data.getLastTrialData();
            return !responses.select("pass").values[0];
        }
    }
}