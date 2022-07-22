function intro(instructionsParams) {
    return {
        timeline: [
            preload(),
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
        stimulus: `
        <h3>Please read this consent agreement carefully before deciding whether to participate in this experiment.</h3>
        <p><b>Purpose of the research:</b> To examine how people teach effectively.</p>
        <p><b>What you will do in this research:</b> You will teach students the turtle composition of different islands.</p>
        <p><b>Time required:</b> This experiment will take ${instructionsParams.completionMinutes} minutes to complete.</p>
        <p><b>Risks:</b> There are no anticipated risks associated with participating in this study. \
            The effects of participating should be comparable to those you would experience from viewing a computer monitor \
            and using a mouse and keyboard for the duration of the experiment.</p>
        <p><b>Benefits:</b> The study provides important information about the nature of teaching.</p>
        <p><b>Compensation:</b> You will receive <b>$${instructionsParams.basePay}</b> for completing the experiment and a performance bonus of up to <b>$${instructionsParams.maxBonus}</b>.</p>
        <p><b>Confidentiality:</b> Your participation in this study will remain confidential. \
            No personally identifiable information will be associated with your data. \
            Your de-identified data may be shared with other researchers and used in future projects.</p>
        <p><b>Participation and withdrawal:</b> Your participation in this study is completely voluntary and \
            you may refuse to participate or you may choose to withdraw at any time without penalty or loss of
            benefits to which you are otherwise entitled.</p>
        <p><b>How to contact the researcher:</b> If you have questions or concerns about your participation\
            or payment, or want to request a summary of research findings, please contact
            Alicia Chen, aliciachen@college.harvard.edu.</p>
        <p><b>Whom to contact about your rights in this research:</b> For questions, concerns, suggestions, \
            or complaints that have not been or cannot be addressed by the researcher, or to report \
            research-related harm, please contact the Committee on the Use of Human Subjects in Research at Harvard University, \
            1414 Massachusetts Avenue, Second Floor, Cambridge, MA 02138. Phone: 617-496-2847. Email: cuhs@fas.harvard.edu.</p>
        `,
        choices: ['I consent']
    }
}