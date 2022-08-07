var survey = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <p>You have reached the end of the experiment! To collect your bonus, please complete the following questions. </p>
        `,
    html:
        '<p><div style="margin-left:0%;text-align: left">Which gender do you most identify with?</div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice1" name="gender" value="male"><label for="genderChoice1">Male</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice2" name="gender" value="female"><label for="genderChoice2">Female</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice3" name="gender" value="nonconforming"><label for="genderChoice3">Gender Variant/Non-Conforming</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice4" name="gender" value="abstain" required><label for="genderChoice4">Prefer not to answer</label></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"><label for="age">Enter your age:</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="text" id="age" name="age" required></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"> Did you understand the instructions?</div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="understoodChoice1" name="understood" value="yes" required><label for="understoodChoice1">Yes</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="understoodChoice2" name="understood" value="no"><label for="understoodChoice2">No</label></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"><label for="strategy">What was the strategy you used?</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="text" id="strategy" name="strategy"></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"><label for="comments">Comments or suggestions?</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="text" id="comments" name="comments"></div></p>'
    ,
    button_label: ['Continue, save data, and collect bonus!'],
    data: { type: 'response' },
    on_finish:
        function (data) {
            data.totalBonus = Number(jsPsych.data.get().select('bonus').sum().toFixed(2));
            data.nAttentionPassed = jsPsych.data.get().select('attentionPassed').sum();
            data.attentionChecksPassed = data.nAttentionPassed == 3 ? true : false;
        },
};

var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {

        var totalBonus = jsPsych.data.get().select('bonus').sum().toFixed(2);
        var totalPay = Number(totalBonus) + Number(params.basePay);
        return `
                <p>Thanks for participating in the experiment!</p>
                <p>Your total bonus is <b>$${totalBonus}</b>.</p>
                <p>Your total pay is <b>$${totalPay}</b></p>
                <p>If you were curious, you weren't interacting with a real learner.</p>
                <p>Press any key to exit and collect your bonus.</p>
                <p>After you exit, it is safe to close the screen and your responses will be saved automatically.</p>
                `;

    }
};