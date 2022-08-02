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
            On this island, tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold} and a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}.
            </h2>` + makeGrid(trial.capThreshold, trial.capDirection, trial.stemThreshold, trial.stemDirection) +
            `<p style="text-align: center;">In this block, you will be teaching ${trial.scenario == 'nonSeqPartial' || trial.scenario == 'nonSeqFull' ? '<b>one</b> lesson' : '<b>two</b> lessons'} to Student ${trial.studentIdx + 1}.</p>`
        ,
        choices: ['Continue']
    }
}

function makeLabels(threshold, direction, nLabels) {
    var labels = []
    for (let label = 1; label <= nLabels; label++) {
        if (label < threshold) {
            if (direction === 'less') {
                labels.push(`<span style="color:ForestGreen">${label}</span>`)
            } else {
                labels.push(`<span style="color:Red">${label}</span>`)
            }
        } else if (label > threshold) {
            if (direction === 'less') {
                labels.push(`<span style="color:Red">${label}</span>`)
            } else {
                labels.push(`<span style="color:ForestGreen">${label}</span>`)
            }
        } else {
            labels.push(label)
        }
    }
    return labels;
}
// TODO: stim function that takes in trial type
function checkResponseInConcept(data, trial) {
    var stemResponse = data.values()[0].response1
    var capResponse = data.values()[0].response2

    var stemOK = trial.stemDirection === 'less' ? stemResponse < trial.stemThreshold : stemResponse > trial.stemThreshold
    var capOK = trial.capDirection === 'less' ? capResponse < trial.capThreshold : capResponse > trial.capThreshold
    return !(stemOK && capOK)
}

function firstExample(instructionsParams, trial, jsPsych) {
    var firstExampleTrial = {
        type: jsPsychDoubleSliderReconstruction,
        require_movement: true,
        stim: `
        ${trial.scenario == 'nonSeqFull' ?
                `<h2>
            On this island, tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold} and a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}.
            </h2>
            <div>
            <p style="color:DodgerBlue; text-align: center;">Student ${trial.studentIdx + 1} comes from
                ${trial.prior == 'stem' ? `
                a classroom where they learned that tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold}, but don't know about their <b>cap width</b>.
                ` : `
                a classroom where they learned that tasty mushrooms have a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}, but don't know about their <b>stem height</b>.
                `}
            </p>
            </div>
            <p>
            Select an example tasty mushroom to send to your student.
            </p>`
                :
                `<h2>
            On this island, tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold} and a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}.
            </h2>
            <div style="color:DodgerBlue; text-align: center;">Student ${trial.studentIdx + 1} comes from <b>either</b></div>
            <ul style="color:DodgerBlue; display: inline-block; text-align: left;">
                <li>
                a classroom where they learned that tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold}, but don't know about their <b>cap width</b>.
                </li>
                <li>
                a classroom where they learned that tasty mushrooms have a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}, but don't know about their <b>stem height</b>.
                </li>
            </ul>
            <p>
            Select an example tasty mushroom to send to your student.
            </p>`
            }
        `,
        stim_function: function (stemVal, capVal) {
            return `
            <div>
            <img src='img/mushroom_s${stemVal}c${capVal}.png' width="200"></img>
            </div>
            `
        },
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
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {

            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: trial.studentIdx, exampleSet: 'first' }).values()[0]
            // console.log(firstResponse);

            return `
                ${firstResponse.scenario === 'seqFeedback' ? `student guess filler` : ''}
                <p>${firstResponse.scenario === 'seqFeedback' ? `You will now send another mushroom to your student.` : ''}</p>
                <p>Press any key to continue.</p>`
        },
        trial_duration: 20000
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
    return {
        type: jsPsychDoubleSliderReconstruction,
        require_movement: true,
        stim: function () {
            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: trial.studentIdx, exampleSet: 'first' }).values()[0]
            var stemHeightSent = firstResponse.response1
            var capWidthSent = firstResponse.response2
            return `
        ${trial.scenario == 'seqFeedback' ?
                    `<h2>
                    On this island, tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold} and a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}.
                    </h2>
                    <div style="color:DodgerBlue; text-align: center;">Student ${trial.studentIdx + 1} comes from <b>either</b></div>
                    <ul style="color:DodgerBlue; display: inline-block; text-align: left;">
                        <li>
                        a classroom where they learned that tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold}, but don't know about their <b>cap width</b>.
                        </li>
                        <li>
                        a classroom where they learned that tasty mushrooms have a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}, but don't know about their <b>stem height</b>.
                        </li>
                    </ul>
                    <p>
                    Your student guessed that the mushrooms circled in green are tasty.
                    </p>
                    <p>
                    Select a second example tasty mushroom to send to your student.
                    </p>`
                    :
                    `<h2>
            On this island, tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold} and a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}.
            </h2>
            <div style="color:DodgerBlue; text-align: center;">Student ${trial.studentIdx + 1} comes from <b>either</b></div>
            <ul style="color:DodgerBlue; display: inline-block; text-align: left;">
                <li>
                a classroom where they learned that tasty mushrooms have a <b>stem height</b> of ${trial.stemDirection == 'less' ? 'less' : 'greater'} than ${trial.stemThreshold}, but don't know about their <b>cap width</b>.
                </li>
                <li>
                a classroom where they learned that tasty mushrooms have a <b>cap width</b> of ${trial.capDirection == 'less' ? 'less' : 'greater'} than ${trial.capThreshold}, but don't know about their <b>stem height</b>.
                </li>
            </ul>
            <p>
            Select a second example tasty mushroom to send to your student.
            </p>`
                }`
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
            return jsPsych.randomization.sampleWithoutReplacement([4000, 4500, 5000], 1)[0];
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

