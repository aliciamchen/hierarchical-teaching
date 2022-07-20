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
    teacherSets: teacherSets,
    hyperParams: hyperParams,
    conditions: conditions,
    teacherPairings: teacherPairings,
    hyperPairings: hyperPairings,
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
        save_data_json(subjectId + "_output_responsesOnly", 
                    jsPsych.data.get().filter({ type: 'response' }).json())
    },
    timing_post_trial: 0
};



/* Experiment */

var timeline = [];

var preload = {
    type: jsPsychPreload,
    images: ['img/archipelago.png']
};
timeline.push(preload);

// from introduction.js
// timeline.push(welcome, consent);

// from instructions.js
// timeline.push(comprehensionLoop);

// from introduction.js
// timeline.push(beginning, firstIslandWarning);


/* Main logic of trials */

// makes combinations of possible nonseq trials, randomly orders
var design = jsPsych.randomization.shuffle(
    jsPsych.randomization.factorial(factorsNonSeqPrior, 1).concat( 
    jsPsych.randomization.factorial(factorsNonSeqNoPrior, 1)));


// makes nonseq attention checks
var attention_locations = [3, 8];
var attention_params = [[70, 0], [35, 35]]; // turtle breakdown options
var attention_trials = [];

for (let i = 0; i < attention_locations.length; i++) {
    // from attention.js
    nonSeqAttentionTrial(i);
};


// Loop through individual trials in design to create timeline
for (let i = 0; i < design.length; i++) {
    // from nonseq.js
    nonSequentialTrial(i);
};

// creates design + attention checks for sequential conditions
var len = design.length;
var design = jsPsych.randomization.factorial(factorsSeq, 1);
var adaptiveA = [2, 3, 5, 7];
var attention_locations = [13];
var attention_params = [[70, 0], [35, 35], [0, 70]]; // turtle breakdown options
var attention_trials = [];

// from instructions.js
// timeline.push(seqComprehensionLoop);

for (let i = 0; i < attention_locations.length; i++) {
    // from attention.js
    seqAttentionTrial(i);
};


// loop through individual trials in design to create timeline
for (let i = 0; i < design.length; i++) {
    // from trials.js
    sequentialTrial(i);
};

// from conclusion.js
timeline.push(survey);

if (!local_testing) {
    timeline.push(save_data);
}

// from conclusion.js
timeline.push(debrief_block);

jsPsych.run(timeline.flat());