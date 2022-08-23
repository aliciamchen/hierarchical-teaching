function makeAllTrials(design, jsPsych) {


    const attentionLocations = [3, 8, 14]
    const attentionParams = [[1, 8], [8, 1], [4, 5]]
    var attentionTrials = makeAttentionTrials(attentionParams, jsPsych)
    var sentAttention = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Mushroom sent to student!',
        choices: "NO_KEYS",
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([3000, 4000, 4500], 1)[0];
        }
    }

    // for trial in design
    trials = []
    for (let i = 0; i < design.length; i++) {
        var currTrial = design[i]
        currTrial['studentIdx'] = i
        trials.push(makeTrialsForScenario(instructionsParams, currTrial, design, jsPsych))

        // Add attention check
        if (attentionLocations.includes(i)) {
            trials.push(jsPsych.randomization.sampleWithoutReplacement(attentionTrials, 1)[0])
            trials.push(sending(jsPsych))
            trials.push(sentAttention)
        }
    }
    return trials.flat()
}

function beginning() {

    var beginning = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:30px;">Congrats on passing the comprehension quiz! The experiment will begin in a few seconds.</div>',
        choices: "NO_KEYS",
        trial_duration: 3000,
    };

    var firstStudentWarning = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:50px;">First student</div>',
        choices: "NO_KEYS",
        trial_duration: 3000,
    };

    return [beginning, firstStudentWarning]
}

function makeAttentionTrials(attentionParams, jsPsych) {
    var attentionTrials = []

    for (let i = 0; i < attentionParams.length; i++) {

        var attentionMain = {
            type: jsPsychDoubleSliderReconstruction,
            require_movement: true,
            stim: `
            <h2>This is an attention check.</h2>
            <p>
            Select a mushroom with a stem height of <b>${attentionParams[i][0]}</b> and a cap width of <b>${attentionParams[i][1]}</b>.
            </p>
            `,
            stim_function: function (stemVal, capVal) {
                return `
                <div>
                <img src='img/mushroom_s${stemVal}c${capVal}.png' width="200"></img>
                </div>
                `
            },
            allowed1vals: _.range(1, 9),
            allowed2vals: _.range(1, 9),
            labels_1: makeLabels(0.5, 'greater', 8),
            labels_2: makeLabels(0.5, 'greater', 8),
            min: 1,
            max: 8,
            prompt1: 'Stem height',
            prompt2: 'Cap width',
            slider_width: 500,
            button_label: 'Send mushroom to student',
            trial_duration: instructionsParams.timeout * 1000,
            data: {
                type: 'attention',
                attentionParams: attentionParams[i]
            },
            on_finish: function (data) {
                data.passAttentionCheck = (data.response1 == data.attentionParams[0]) && (data.response2 == data.attentionParams[1])
                // console.log(data.passAttentionCheck)
            }
        }

        attentionTrials.push(attentionMain)

    }
    return attentionTrials
}


function makeTrialsForScenario(instructionsParams, trial, design, jsPsych) {
    // TODO: if statements that return a specific timeline based on the trial type
    const trialsInScenario = {
        'nonSeqFull': [classroomInfo(trial), firstExampleTwoMushrooms(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)],
        'nonSeqPartial': [classroomInfo(trial), firstExampleTwoMushrooms(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)],
        'seqNoFeedback': [classroomInfo(trial), firstExampleFreeResponse(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), secondExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)],
        'seqFeedback': [classroomInfo(trial), firstExampleFreeResponse(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), feedback(trial, jsPsych), secondExample(instructionsParams, trial, jsPsych), sending(jsPsych), sent(jsPsych), finish(), fixation(trial, design, jsPsych)]
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

function firstExampleTwoMushrooms(instructionsParams, trial, jsPsych) {
    var gridhtml = $('#mushroomGrid').html()
    return {
        type: jsPsychHtmlSliderResponse,
        stimulus: makeExamplePreamble(trial) + `<p style="margin-bottom: 2cm; text-align: center;">Which <b style="color: #648fff">tasty</b> mushroom would you like to send to your student?</p>`,
        require_movement: true,
        slider_width: 500,
        labels: makeTwoMushrooms(trial),
        trial_duration: instructionsParams.timeout * 100000,
        data: {
            type: 'response',
            scenario: trial.scenario,
            prior: trial.prior,
            stemThreshold: trial.stemThreshold,
            capThreshold: trial.capThreshold,
            stemDirection: trial.stemDirection,
            capDirection: trial.capDirection,
            studentIndex: trial.studentIdx,
            leftMushroomHTML: makeTwoMushrooms(trial)[0],
            rightMushroomHTML: makeTwoMushrooms(trial)[1],
            exampleSet: 'first'
        },
        on_finish: function(data) {
            data.mushroomSelected = data.response < 50 ? 'stemBoundary' : 'capBoundary'
        },
        button_label: ['Send mushroom to student']
    }
}

function firstExampleFreeResponse(instructionsParams, trial, jsPsych) {
    return {
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
        allowed1vals: trial.stemDirection === 'less' ? _.filter(_.range(1, 9), function (i) { return i < trial.stemThreshold }) : _.filter(_.range(1, 9), function (i) { return i > trial.stemThreshold }),
        allowed2vals: trial.capDirection === 'less' ? _.filter(_.range(1, 9), function (i) { return i < trial.capThreshold }) : _.filter(_.range(1, 9), function (i) { return i > trial.capThreshold }),
        labels_1: makeLabels(trial.stemThreshold, trial.stemDirection, 8),
        labels_2: makeLabels(trial.capThreshold, trial.capDirection, 8),
        min: 1,
        max: 8,
        prompt1: 'Stem height',
        prompt2: 'Cap width',
        slider_width: 500,
        button_label: 'Send mushroom to student',
        trial_duration: instructionsParams.timeout * 1000,
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
            data.feedback = fetchLearnerFeedback(trial, data.response1, data.response2)
            console.log(data.feedback)
        }
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
            var stemResponse = firstResponse.response1
            var capResponse = firstResponse.response2
            var learnerFeedback = fetchLearnerFeedback(trial, stemResponse, capResponse)
            console.log(learnerFeedback)

            var grid = makeGridFromHTML(learnerFeedback.capThreshold, learnerFeedback.capDirection, learnerFeedback.stemThreshold, learnerFeedback.stemDirection, gridhtml, '3vw') // testing; change later

            return `<h2>Your student guessed that the shaded mushrooms below are tasty:</h2> <br>` + grid + `
                ${firstResponse.scenario === 'seqFeedback' ? `` : ``}
                <p>${firstResponse.scenario === 'seqFeedback' ? `<p style="text-align: center;">You will now send another mushroom to your student.</p>` : ''}</p>`
        },
        choices: ['Continue'],
        trial_duration: 20000
    }
}

function sending(jsPsych) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Sending mushroom to student... ',
        choices: "NO_KEYS",
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([1250, 1500, 1750], 1)[0];
        }
    }
}

function secondExample(instructionsParams, trial, jsPsych) {
    var gridhtml = $('#mushroomGrid').html()
    var myhtml = $('#templates').html()
    return {
        type: jsPsychHtmlSliderResponse,
        stimulus: function () {
            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: trial.studentIdx, exampleSet: 'first' }).values()[0]
            var stemResponse = firstResponse.response1
            var capResponse = firstResponse.response2
            var learnerFeedback = fetchLearnerFeedback(trial, stemResponse, capResponse)
            var grid = makeGridFromHTML(learnerFeedback.capThreshold, learnerFeedback.capDirection, learnerFeedback.stemThreshold, learnerFeedback.stemDirection, gridhtml, '1.1vw') // testing; change later

            return trial.scenario === 'seqFeedback' ?
                (makeExamplePreambleFromHTML(trial, myhtml)
                    + `<h4>Your student guessed that the shaded mushrooms below are tasty:</h4>`
                    +   grid
                    + `<br>`
                    + `<p style="text-align: center;">Now, which <b style="color: #648fff">tasty</b> mushroom would you like to send to your student?</p>`)
                : (
                    makeExamplePreambleFromHTML(trial, myhtml)
                    + `<br>`
                    + `<p style="text-align: center;">Now, which <b style="color: #648fff">tasty</b> mushroom would you like to send to your student?</p>`
                )
        },
        require_movement: true,
        slider_width: 500,
        labels: makeTwoMushrooms(trial),
        trial_duration: instructionsParams.timeout * 1000,
        data: {
            type: 'response',
            scenario: trial.scenario,
            prior: trial.prior,
            stemThreshold: trial.stemThreshold,
            capThreshold: trial.capThreshold,
            stemDirection: trial.stemDirection,
            capDirection: trial.capDirection,
            studentIndex: trial.studentIdx,
            leftMushroomHTML: makeTwoMushrooms(trial)[0],
            rightMushroomHTML: makeTwoMushrooms(trial)[1],
            exampleSet: 'second'
        },
        on_finish: function(data) {
            data.mushroomSelected = data.response < 50 ? 'stemBoundary' : 'capBoundary'
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
        trial_duration: 10000
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



