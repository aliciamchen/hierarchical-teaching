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
    hyperParams: hyperParams,
    conditions: conditions,
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
                    jsPsych.data.get().filter({ type: 'response' }).json());
        save_data_json(subjectId + "_output_attention",
                    jsPsych.data.get().filter({ type: 'attention' }).json());
    },
    timing_post_trial: 0
};



/* Experiment */

var timeline = [];

var preload = {
    type: jsPsychPreload,
    images: ['img/archipelago.png', 'img/9orange1purple.png', 'img/1orange9purple.png', 'img/0.1o0.9p.png', 'img/0.3o0.7p.png', 'img/0.7o0.3p.png', 'img/0.9o0.1p.png']
};

timeline.push(preload, welcome, consent, comprehensionLoop, beginning, firstIslandWarning);


/* Main logic of trials */

// makes combinations of possible nonseq trials, randomly orders
var design = jsPsych.randomization.factorial(factors, 1);

// makes nonseq attention checks
var attention_locations = [3, 9], attention_trials = [];
var attention_params = [{knowledge: "full", feedback: "no"},
                        {knowledge: "partial", feedback: "yes"}];

for (let i = 0; i < attention_locations.length; i++) {
    attentionTrial(i);
};

// Loop through individual trials in design to create timeline
for (let i = 0; i < design.length; i++) {
    sequentialTrial(i);
};


timeline.push(survey);

if (!local_testing) { timeline.push(save_data) };

timeline.push(debrief_block);

jsPsych.run(timeline.flat(Infinity));