function comprehensionLoop(instructionsParams, jsPsych) {

    return {
        timeline: [instructions(instructionsParams), comprehensionCheck(instructionsParams), failComprehensionCheck(jsPsych)],
        loop_function: function (data) {
            return !data.select("pass").values[0];
        }
    };

}
function comprehensionCheck(instructionsParams) {
    return {
        type: jsPsychSurveyMultiChoice,
        questions: [
            {
                prompt: `What are the differences between different students' past experience?`,
                options: [
                    'Students will have seen a different number of tasty and bitter mushrooms from the island before seeing the new mushroom(s) you show them.',
                    'Students will have seen a bunch of different types of islands before seeing the new turtles you show them.',
                    `Students will know either the cap width or the stem height rule on the island, but not both rules.`,
                    `All students' experience is the same, so I will treat all students the same.`
                ],
                required: true
            },
            {
                prompt: 'How can I earn a high performance bonus?',
                options: [
                    `By not considering what my students already know on the island and instead selecting a random mushroom on each lesson.`,
                    `By considering what my students already know about the island so that I can teach accurately/helpfully.`
                ],
                required: true
            },
            {
                prompt: `Is there a chance I'll encounter the same student twice (not including the students I'll teach over two lessons)?`,
                options: [
                    'Yes, I might encounter the same student twice.',
                    'No, I will teach a <b>new</b> student each time.'
                ],
                required: true
            },
            {
                prompt: `For the students to whom I'll show two sets of mushrooms (over two lessons), how will my bonus be calculated?`,
                options: [
                    `Based on the student's first guess.`,
                    `Based on the student's second (and final) guess.`,
                    'Based on both guesses.'
                ],
                required: true
            }
        ],
        randomize_question_order: true,

        on_finish: function (data) {
            data.pass = [data.response.Q0.includes('stem'), data.response.Q1.includes('accurately'), data.response.Q2.includes('new'), data.response.Q3.includes('final')].every(Boolean)
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