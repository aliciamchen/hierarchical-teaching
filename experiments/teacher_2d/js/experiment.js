
const instructionsParams = {
    completionMinutes: 30,
    basePay: 5,
    maxBonus: 10,
    perTrialBonus: 0.7,
    feedbackCondition: 'studentPassive',
    timeout: 90, // seconds
    nStudents: 16
};

const scenarios = ['nonSeqFull', 'nonSeqPartial', 'seqNoFeedback', 'seqFeedback'];
const classroomPriors = ['stem', 'cap']

const trueConceptOptions = {
    stemThresholds: [2.5, 4.5, 6.5],
    capThresholds: [2.5, 4.5, 6.5],
    stemDirections: ['less', 'greater'],
    capDirections: ['less', 'greater']
}

const factors = {
    scenario: scenarios,
    prior: classroomPriors,
    stemThreshold: trueConceptOptions.stemThresholds,
    capThreshold: trueConceptOptions.capThresholds,
    stemDirection: trueConceptOptions.stemDirections,
    capDirection: trueConceptOptions.capDirections
};

// for testing
const testTrialSeq = {
    scenario: 'seqFeedback',
    prior: 'stem',
    stemThreshold: 4.5,
    capThreshold: 2.5,
    stemDirection: 'less',
    capDirection: 'less',
    studentIdx: 1
}

$(function () {
    $('#templates').hide();

    const local_testing = false;

    var jsPsych = initJsPsych({
        on_finish: function () {
            if (local_testing) {
                jsPsych.data.get().localSave("json", "testdata.json");
            }
        },
        show_progress_bar: true
    });

    jsPsych.data.addProperties({
        instructionsParams: instructionsParams,
        factors: factors
    });

    /* Save stuff */

    function save_data_json(name, data) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./save_data.php");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ filename: name, filedata: data }));
    };

    const turkInfo = jsPsych.turk.turkInfo();

    const subjectId =
        local_testing || turkInfo.workerId == ""
            ? jsPsych.randomization.randomID(12)
            : turkInfo.workerId;

    jsPsych.data.addProperties({
        subjectId: subjectId,
        assignmentId: turkInfo.assignmentId,
        hitId: turkInfo.hitId,
        url: window.location.href
    });

    const save_data = {
        type: jsPsychCallFunction,
        func: function () {
            save_data_json("output_all_" + subjectId, jsPsych.data.get().json());
            save_data_json("output_responsesOnly_" + subjectId, jsPsych.data.get().filter({ type: 'response' }).json())
            save_data_json("output_attention_" + subjectId, jsPsych.data.get().filter({ type: 'attention' }).json())
        },
        timing_post_trial: 0
    };



    /* Experiment */

    var fullDesign = jsPsych.randomization.factorial(factors, 1);
    var design = jsPsych.randomization.sampleWithoutReplacement(fullDesign, instructionsParams.nStudents)

    var timeline = [];
    timeline.push(preload())
    timeline.push(intro(instructionsParams))
    timeline.push(comprehensionLoop(instructionsParams, jsPsych))
    timeline.push(beginning())
    timeline.push(makeAllTrials(design, jsPsych))

    // for testing
    // timeline.push(makeTrialsForScenario(instructionsParams, testTrialSeq, design, jsPsych))

    timeline.push(exitSurvey(jsPsych))
    if (!local_testing) {
        timeline.push(save_data);
    }

    timeline.push(debrief())


    jsPsych.run(timeline.flat());
})
