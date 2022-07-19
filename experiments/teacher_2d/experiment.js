const instructionsParams = {
    completionMinutes: 30,
    basePay: 5,
    maxBonus: 10,
    perTrialBonus: 0.7,
    feedbackCondition: 'studentPassive',
    timeout: 30 // seconds
};

const scenarios = ['nonSeqFull', 'nonSeqPartial', 'seqNoFeedback', 'seqFeedback'];
const classroomPriors = ['stem', 'cap']
const trueConceptOptions = {
    stemThresholds: [4, 6],
    capThresholds: [4, 6],
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

/* Start experiment */

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
        save_data_json(subjectId + "_output_all", jsPsych.data.get().json());
        save_data_json(subjectId + "_output_responsesOnly", jsPsych.data.get().filter({ type: 'response' }).json())
        save_data_json(subjectId + "_output_attention", jsPsych.data.get().filter({ type: 'attention' }).json())
    },
    timing_post_trial: 0
};



/* Experiment */

var design = jsPsych.randomization.factorial(factors, 1);

var timeline = [];

// var testFirstEx = firstExample(instructionsParams, design[0], jsPsych)
// timeline.push(testFirstEx)

var allTrials = makeAllTrials(design, jsPsych)
console.log(allTrials)
timeline.push(allTrials)
// var slidertest = {
//     type: jsPsychDoubleSliderReconstruction,
//     require_movement: true,
//     stim_function: function(param1, param2) {
//         return `${param1} and ${param2}`
//     },
//     labels: [1, 8],
//     min: 1,
//     max: 8,
//     prompt1: 'prompt1',
//     prompt2: 'prompt2',
//     slider_width: 400
// };

// timeline.push(slidertest)
console.log(jsPsych.data.getLastTrialData())
// timeline.push(preload);


// Welcome and introduction
// timeline.push(intro())

var comprehensionLoop = {
    timeline: [instructions(instructionsParams), comprehensionCheck(instructionsParams), failComprehensionCheck(jsPsych)],
    loop_function: function (data) {
        return !data.select("pass").values[0];
    }
};

// timeline.push(comprehensionLoop);




// design (pass in `design` )

jsPsych.run(timeline.flat());