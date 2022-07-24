function intro(instructionsParams) {
    return {
        timeline: [
            welcome(),
            consent(instructionsParams)
        ]
    }
}


function welcome() {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Welcome to the experiment. Press any key to begin.',
        trial_duration: 10000
    }
}

function consent(instructionsParams) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: sprintf($('#consent').html(),
            instructionsParams.completionMinutes,
            instructionsParams.basePay,
            instructionsParams.maxBonus),
        choices: ['I consent']
    }
}