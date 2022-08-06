
function exitSurvey() {
    return {
        type: jsPsychSurveyHtmlForm,
        preamble: `
        <p>You have reached the end of the experiment! To collect your bonus, please complete the following questions. </p>
        `,
        html: $('#exitSurvey').html(),
        button_label: ['Continue, save data, and collect bonus!'],
        data: { type: 'response' },
        on_finish:
            function (data) {
                // var totalBonus = jsPsych.data.get().select('bonus').sum().toFixed(2);
                // data.totalBonus = Number(totalBonus);
                data.nAttentionChecksPassed = jsPsych.data.get().select('passAttentionCheck').sum()
                data.passAllAttentionChecks = jsPsych.data.get().select('passAttentionCheck').sum() >= 2 ? true : false
            },
    }
}

function debrief(instructionsParams, jsPsych){
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {

            // var totalBonus = jsPsych.data.get().select('bonus').sum().toFixed(2);
            // var totalPay = Number(totalBonus) + Number(instructionsParams.basePay);
            return `
                    <p>Thanks for participating in the experiment!</p>
                    <p>If you were curious, you weren't interacting with a real learner.</p>
                    <p>Press any key to exit and collect your bonus.</p>
                    <p>After you exit, it is safe to close the screen and your responses will be saved automatically.</p>
                    `;

        }
    }
}
