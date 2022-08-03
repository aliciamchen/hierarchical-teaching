function makeAllTrials(design, jsPsych) {

    // todo: loop through design, do `makeTrial` for each part
    // TODO: add attention trials here s

    // for trial in design
    trials = []
    for (let i = 0; i < design.length; i++) {
        var currTrial = design[i]
        currTrial['studentIdx'] = i
        trials.push(makeTrialsForScenario(instructionsParams, currTrial, design, jsPsych))
    }
    return trials.flat()
}


function makeTrialsForScenario(instructionsParams, trial, design, jsPsych) {
    // TODO: if statements that return a specific timeline based on the trial type
    const trialsInScenario = {
        'nonSeqFull': [classroomInfo(trial), firstExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)],
        'nonSeqPartial': [classroomInfo(trial), firstExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)],
        'seqNoFeedback': [classroomInfo(trial), firstExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), secondExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)],
        'seqFeedback': [classroomInfo(trial), firstExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), feedback(trial, jsPsych), secondExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)]
    }

    return trialsInScenario[trial.scenario]
}

function classroomInfo(trial) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <h4 style="color:Blue;">
            Student ${trial.studentIdx + 1}
            </h4>
            <h2>
            On this island, <b style="color:#648FFF;">tasty</b> mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold} and a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}.
            </h2><br>` + makeGrid(trial.capThreshold, trial.capDirection, trial.stemThreshold, trial.stemDirection)
        ,
        choices: ['Continue']
    }
}


function firstExample(instructionsParams, trial, jsPsych) {
    var firstExampleTrial = {
        type: jsPsychDoubleSliderReconstruction,
        require_movement: true,
        stim: makeExamplePreamble(trial) + `<b>Select an example <b style="color: #648fff">tasty</b> mushroom to send to your student.</b>`,
        stim_function: function (stemVal, capVal) {
            return `
            <div>
            <img src='img/mushroom_s${stemVal}c${capVal}.png' width="200"></img>
            </div>
            `
        },
        allowed1vals: trial.stemDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < trial.stemThreshold}) : _.filter(_.range(1, 9), function(i) {return i > trial.stemThreshold}),
        allowed2vals: trial.capDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < trial.capThreshold}) : _.filter(_.range(1, 9), function(i) {return i > trial.capThreshold}),
        labels_1: makeLabels(trial.stemThreshold, trial.stemDirection, 8),
        labels_2: makeLabels(trial.capThreshold, trial.capDirection, 8),
        min: 1,
        max: 8,
        prompt1: 'Stem height',
        prompt2: 'Cap width',
        slider_width: 500,
        button_label: 'Send mushroom to student',
        trial_duration: instructionsParams.timeout * 10000,
        data: {
            type: 'response',
            scenario: trial.scenario,
            prior: trial.prior,
            stemThreshold: trial.stemThreshold,
            capThreshold: trial.capThreshold,
            stemDirection: trial.stemDirection,
            capDirection: trial.capDirection,
            studentIndex: trial.studentIdx,
            exampleSet: 'first'
        }
        ,
        on_finish: function (data) {
            // TODO: add feedback stuff here
            data.feedback = 'placeholder feedback'
        }
    }

    return {
        timeline: [firstExampleTrial],
        loop_function: function (data) { return checkResponseInConcept(data, trial) }
    }
}


function feedback(trial, jsPsych) {
    // extract gridhtml, this doesn't work otherwise
    var gridhtml = $('#mushroomGrid').html()
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function () {

            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: trial.studentIdx, exampleSet: 'first' }).values()[0]
            var grid = makeGridFromHTML(1.5, 'less', 5.5, 'greater', gridhtml) // testing; change later

            return `<h2>Your student guessed that the shaded mushrooms below are tasty:</h2> <br>` + grid + `
                ${firstResponse.scenario === 'seqFeedback' ? `` : ``}
                <p>${firstResponse.scenario === 'seqFeedback' ? `You will now send another mushroom to your student.` : ''}</p>`
        },
        choices: ['Continue'],
        trial_duration: 2000000
    }
}

function sending(jsPsych) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Sending mushroom to student... ',
        choices: "NO_KEYS",
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([1250, 1500, 1750, 2000], 1)[0];
        }
    }
}

function secondExample(instructionsParams, trial, jsPsych) {
    var preamblesHTML = $('#preambles').html()
    var gridhtml = $('#mushroomGrid').html()
    // TODO: set sizing
    // console.log(preamblesHTML)
    return {
        type: jsPsychDoubleSliderReconstruction,
        require_movement: true,
        stim: function () {
            // console.log(preamblesHTML)
            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: trial.studentIdx, exampleSet: 'first' }).values()[0]
            var stemHeightSent = firstResponse.response1
            var capWidthSent = firstResponse.response2
            // console.log(makeExamplePreambleFromHTML(trial, preamblesHTML))
            return makeExamplePreambleFromHTML(trial, preamblesHTML) + `<h4>Your student guessed that the shaded mushrooms below are tasty:</h4>` + makeGridFromHTML(1.5, 'less', 5.5, 'greater', gridhtml) + `<b>Select a second <b style="color: #648fff">tasty</b> mushroom to send to your student.</b>`
        },
        stim_function: function (stemVal, capVal) {
            return `
            <div>
            <img src='img/mushroom_s${stemVal}c${capVal}.png' width="200"></img>
            </div>
            `
        },
        labels_1: makeLabels(trial.stemThreshold, trial.stemDirection, 8),
        labels_2: makeLabels(trial.capThreshold, trial.capDirection, 8),
        allowed1vals: trial.stemDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < trial.stemThreshold}) : _.filter(_.range(1, 9), function(i) {return i > trial.stemThreshold}),
        allowed2vals: trial.capDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < trial.capThreshold}) : _.filter(_.range(1, 9), function(i) {return i > trial.capThreshold}),
        min: 1,
        max: 8,
        prompt1: 'Stem height',
        prompt2: 'Cap width',
        slider_width: 500,
        button_label: 'Send mushroom to student',
        trial_duration: instructionsParams.timeout * 10000,
        data: {
            type: 'response',
            scenario: trial.scenario,
            prior: trial.prior,
            stemThreshold: trial.stemThreshold,
            capThreshold: trial.capThreshold,
            stemDirection: trial.stemDirection,
            capDirection: trial.capDirection,
            studentIndex: trial.studentIdx,
            exampleSet: 'second'
        }
        ,
        on_finish: function (data) {
            // TODO: add feedback stuff here
            data.bonus = 'placeholder calculated bonus'
        }
    }
}

function sent(jsPsych) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Mushroom sent to student! Waiting for student...',
        choices: "NO_KEYS",
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([3000, 4000, 4500], 1)[0];
        }
    }
}

function finish() {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            return `
                <p>Time to move on to the next student! Press any key to continue.</p>
                `
        },
        trial_duration: 20000
    }
}


function fixation(trial, design, jsPsych) {
    return {
        timeline: [
            {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: '<div style="font-size:60px;">Next student</div>',
                choices: "NO_KEYS",
                trial_duration: function () {
                    return jsPsych.randomization.sampleWithoutReplacement([2000, 2250, 2500, 3000], 1)[0];
                }
            }
        ],

        // Skip if we are on last trial
        conditional_function: function () {
            if (trial.studentIdx === design.length - 1) {
                return false;
            } else {
                return true;
            }
        }
    }
}

// for (let i = 0; i < design.length; i++) {





//     // timeline.push(trialsInCondition[currTrial.condition])

//     // Add attention check
//     if (attention_locations.includes(i)) {
//         // timeline.push(jsPsych.randomization.sampleWithoutReplacement(attention_trials, 1)[0]);
//         // timeline.push([sending, sent, fixation])
//     }
// }

