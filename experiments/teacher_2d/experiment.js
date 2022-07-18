const params = {
    nStudents: 16,
    maxExamples: 70,
    completionMinutes: 30,
    basePay: 5,
    maxBonus: 12,
    perTrialBonus: 0.7,
    perTrialBonusThreshold: 0.08,
    exampleCost: 0.01,
    feedbackCondition: 'studentPassive'
};

const classroomParams = {
    A: { a: 1, b: 9 },
    B: { a: 9, b: 1 }
};

const conditions = ['nonSeqFull', 'nonSeqPartial', 'seqNoFeedback', 'seqFeedback'];
const classroomPairings = [['A', 'B']];
const coinWeights = [0.3, 0.7];

const trueClassrooms = classroomPairings.flat();

const factors = {
    condition: conditions,
    classroomPairing: classroomPairings,
    coinWeight: coinWeights,
    trueClassroom: trueClassrooms
};

var start_time;
var end_test_timer;



/* Start experiment */

const local_testing = false;

var jsPsych = initJsPsych({
    on_finish: function () {
        if (local_testing) {
            jsPsych.data.get().localSave("json", "testdata.json"); // add datetime later
        }
    },
    show_progress_bar: true
});

jsPsych.data.addProperties({
    params: params,
    classroomParams: classroomParams,
    conditions: conditions,
    classroomPairings: classroomPairings,
    coinWeights: coinWeights
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


var timeline = [];

var slidertest = {
    type: jsPsychDoubleSliderReconstruction,
    require_movement: true,
    stim_function: function(param1, param2) {
        return `${param1} and ${param2}`
    },
    labels: [1, 8],
    min: 1,
    max: 8,
    prompt1: 'prompt1',
    prompt2: 'prompt2',
    slider_width: 400
};

timeline.push(slidertest)
console.log(jsPsych.data.getLastTrialData())
// timeline.push(preload);


// Welcome and introduction
// timeline.push(intro())

var comprehensionLoop = {
    timeline: [instructions(params.feedbackCondition), comprehensionCheck(), failComprehensionCheck(jsPsych)],
    loop_function: function (data) {
        return !data.select("pass").values[0];
    }
};

// timeline.push(comprehensionLoop);


var design = jsPsych.randomization.factorial(factors, 1);

// design (pass in `design` )

jsPsych.run(timeline.flat());
