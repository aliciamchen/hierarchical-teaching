
// Loop through individual trials in design to create timeline
for (let i = 0; i < design.length; i++) {

    var currTrial = design[i];
    var studentTrueClassroom = currTrial.trueClassroom // could pass this in directly but this is quick change from before when it was randomized

    var classroomInfo = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <h4 style="color:Blue;">Student ${i + 1}</h4>
            <h2>On this island, <b style="color:Orange;">${currTrial.coinWeight * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - currTrial.coinWeight).toFixed(1) * 10}</b> out of every 10 turtles are purple.</h2>
            <p>In this block, you will be teaching ${currTrial.condition === 'nonSeqPartial' || currTrial.condition === 'nonSeqFull' ? '<b>one</b> lesson' : '<b>two</b> lessons'} to Student ${i + 1}.</p>`
            ,
        choices: ['Continue']
    }

    var firstExample = {
        type: jsPsychSurveyHtmlForm,
        preamble: `
                <h4 style="color:Blue;">Student ${i + 1}, Lesson 1 of ${currTrial.condition === 'nonSeqPartial' || currTrial.condition === 'nonSeqFull' ? '1' : '2'}</h4>
                ${currTrial.condition === 'nonSeqFull' ? `
                        <h2>On this island, <b style="color:Orange;">${currTrial.coinWeight * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - currTrial.coinWeight).toFixed(1) * 10}</b> out of every 10 turtles are purple.</h2>
                        <h3 style="color:DodgerBlue;">Student info</h3>
                        <p style="color:DodgerBlue;text-align:center">
                            Student ${i + 1} has already seen \
                            <b>${classroomParams[studentTrueClassroom].a + classroomParams[studentTrueClassroom].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[studentTrueClassroom].a}</b> ${classroomParams[studentTrueClassroom].a == 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[studentTrueClassroom].b}</b> ${classroomParams[studentTrueClassroom].b == 1 ? 'is' : 'are'} purple.
                        </p>

                        <div class="center" style="margin-bottom:1cm;">
                        <div><img src='img/${classroomParams[studentTrueClassroom].a}orange${classroomParams[studentTrueClassroom].b}purple.png' width="400"></img>
                        </div>
                        </div>

                        <p>Select a set of additional turtles to show your student.</p>
                        ` : `
                        <h2>On this island, <b style="color:Orange;">${currTrial.coinWeight * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - currTrial.coinWeight).toFixed(1) * 10}</b> out of every 10 turtles are purple.</h2>
                        <h3 style="color:DodgerBlue;">Student info</h3>
                        <div style="color:DodgerBlue; text-align: center;">Student ${i + 1} has already seen <b>either</b></div>
                        <ul style="color:DodgerBlue; display: inline-block; text-align: left;">
                            <li>
                            <b>${classroomParams[currTrial.classroomPairing[0]].a + classroomParams[currTrial.classroomPairing[0]].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[currTrial.classroomPairing[0]].a}</b> ${classroomParams[currTrial.classroomPairing[0]].a === 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.classroomPairing[0]].b}</b> ${classroomParams[currTrial.classroomPairing[0]].b === 1 ? 'is' : 'are'} purple, or
                            </li>
                            <li>
                            <b>${classroomParams[currTrial.classroomPairing[1]].a + classroomParams[currTrial.classroomPairing[1]].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[currTrial.classroomPairing[1]].a}</b> ${classroomParams[currTrial.classroomPairing[1]].a === 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.classroomPairing[1]].b}</b> ${classroomParams[currTrial.classroomPairing[1]].b === 1 ? 'is' : 'are'} purple.
                            </li>
                        </ul>

                        <br>
                        <div style='width: 900px;' class="center">
                        <div style='float: left;'><img src='img/${classroomParams[currTrial.classroomPairing[0]].a}orange${classroomParams[currTrial.classroomPairing[0]].b}purple.png' width="400"></img>
                        <p class='small'><strong>${classroomParams[currTrial.classroomPairing[0]].a + classroomParams[currTrial.classroomPairing[0]].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[currTrial.classroomPairing[0]].a}</b> ${classroomParams[currTrial.classroomPairing[0]].a === 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.classroomPairing[0]].b}</b> ${classroomParams[currTrial.classroomPairing[0]].b === 1 ? 'is' : 'are'} purple</strong></p></div>
                        <div style='float: right;'><img src='img/${classroomParams[currTrial.classroomPairing[1]].a}orange${classroomParams[currTrial.classroomPairing[1]].b}purple.png' width="400"></img>
                        <p class='small'><strong>${classroomParams[currTrial.classroomPairing[1]].a + classroomParams[currTrial.classroomPairing[1]].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[currTrial.classroomPairing[1]].a}</b> ${classroomParams[currTrial.classroomPairing[1]].a === 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.classroomPairing[1]].b}</b> ${classroomParams[currTrial.classroomPairing[1]].b === 1 ? 'is' : 'are'} purple</strong></p></div>
                        </div>
                        <br>


                        <p>Select a set of additional turtles to show your student.</p>
                        `
            }`
        ,
        html: `
                <p> <input name="heads" type="number" required="true" min="0" max="${params.maxExamples}" value="0"/> <b style="color:Orange;">orange</b> turtles </p>
                <p> <input name="tails" type="number" required="true" min="0" max="${params.maxExamples}" value="0"/> <b style="color:Purple;">purple</b> turtles </p>`,
        button_label: 'Send turtles to student',
        data: {
            type: 'response',
            condition: currTrial.condition,
            trueTheta: currTrial.coinWeight,
            classrooms: currTrial.classroomPairing,
            studentTrueClassroom: studentTrueClassroom,
            exampleSet: 'first'
        },
        on_load: function () {
            var start_time = performance.now();
            console.log(start_time)
            end_test_timer = jsPsych.pluginAPI.setTimeout(function () {
                var end_time = performance.now();
                var elapsed_time = end_time - start_time;
                console.log("elapsed time: ", elapsed_time);
                jsPsych.finishTrial({ status: 'timeout' });
            }, 90000)
        }
        ,
        on_finish: function (data) {

            jsPsych.pluginAPI.clearAllTimeouts()
            var end_test_timer = null;

            if (data.response != null) { // if timeout
                var nHeads = parseInt(data.response.heads);
                var nTails = parseInt(data.response.tails);
            } else {
                var nHeads = 0;
                var nTails = 0;
            }


            var studentTrueHypers = classroomParams[data.studentTrueClassroom];
            var studentGuess = ((parseInt(studentTrueHypers.a) + nHeads) / (parseInt(studentTrueHypers.a) + parseInt(studentTrueHypers.b) + nHeads + nTails)).toFixed(2);
            var delta = Math.abs(data.trueTheta - studentGuess);
            var reward = delta <= params.perTrialBonusThreshold + 0.001 ? params.perTrialBonus : 0
            var cost = params.exampleCost * (nHeads + nTails)

            data.heads = nHeads;
            data.tails = nTails;
            data.studentIndex = i;
            data.studentTrueHypers = studentTrueHypers;
            data.studentGuess = studentGuess;
            data.delta = delta;
            data.totalExamples = nHeads + nTails;

            if (data.condition === 'nonSeqFull' || data.condition === 'nonSeqPartial') {
                data.bonus = Number((((reward - cost) > 0) && (data.totalExamples > 0)) ? (reward - cost).toFixed(2) : 0)
            }

            data.bonusSoFar = Number(jsPsych.data.get().select('bonus').sum().toFixed(2))
        }
    };

    var firstExampleLoop = {
        timeline: [firstExample],
        loop_function: function (data) {

            var totalFlips = parseInt(data.values()[0].heads) + parseInt(data.values()[0].tails)

            if (totalFlips <= params.maxExamples) {
                return false; // proceed
            } else {
                return true; // prompt again for answer
            }
        }
    }

    var sending = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Sending turtles to student... ',
        choices: "NO_KEYS",
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([1250, 1500, 1750, 2000], 1)[0];
        }
    }

    var feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {

            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: i, exampleSet: 'first' }).values()[0]

            // console.log(firstResponse);

            return `
                ${firstResponse.condition === 'seqFeedback' ? `<h2>Student guess</h2><p>The student guessed that <b style="color:Orange;">${Math.round(firstResponse.studentGuess * 100)}</b> out of every 100 turtles are \
                orange and <b style="color:Purple;">${Math.round((1 - firstResponse.studentGuess).toFixed(2) * 100)}</b> out of every 100 turtles are purple.</p>` : ''}
                ${(firstResponse.totalExamples == 0) && (firstResponse.condition != 'seqFeedback') ? `<p style="color:Red;">You could not receive a bonus for this student because you did not send any turtles to your student. Make sure to send at least one turtle next time!</p>` : ''}
                <p>${firstResponse.condition === 'seqFeedback' ? `You will now send another set of turtles to your student.` : ''}</p>
                <p>Press any key to continue.</p>`

        },
        trial_duration: 20000
    }

    var secondExample = {
        type: jsPsychSurveyHtmlForm,
        preamble: function () {

            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: i, exampleSet: 'first' }).values()[0]

            return `
                <h4 style="color:Blue;">Student ${i + 1}, Lesson 2 of 2</h4>
                <h2>Select another set of turtles to send to the same student to help them figure out the turtle composition of this island.</h2>
                        <div style="color:DodgerBlue; text-align: center;"><b>Reminders</b></div>
                        <ul style="color:DodgerBlue; display: inline-block; text-align: left;">
                            <li>On this island, <b style="color:Orange;">${firstResponse.trueTheta * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - firstResponse.trueTheta).toFixed(2) * 10}</b> out of every 10 turtles are purple.</li>

                            <li>Your student has seen <b>either</b>
                                <ul>
                                    <li><b>${classroomParams[firstResponse.classrooms[0]].a + classroomParams[firstResponse.classrooms[0]].b}</b> turtles in total, \
                                        of which <b style="color:Orange;">${classroomParams[firstResponse.classrooms[0]].a}</b> ${classroomParams[firstResponse.classrooms[0]].a === 1 ? 'is' : 'are'} orange \
                                        and <b style="color:Purple;">${classroomParams[firstResponse.classrooms[0]].b}</b> ${classroomParams[firstResponse.classrooms[0]].b === 1 ? 'is' : 'are'} purple, or
                                    </li>
                                    <li>
                                        <b>${classroomParams[firstResponse.classrooms[1]].a + classroomParams[firstResponse.classrooms[1]].b}</b> turtles in total, \
                                        of which <b style="color:Orange;">${classroomParams[firstResponse.classrooms[1]].a}</b> ${classroomParams[firstResponse.classrooms[1]].a === 1 ? 'is' : 'are'} orange \
                                        and <b style="color:Purple;">${classroomParams[firstResponse.classrooms[1]].b}</b> ${classroomParams[firstResponse.classrooms[1]].b === 1 ? 'is' : 'are'} purple.
                                    </li>
                                </ul>
                            </li>


                        </ul>
                        <div style='width: 900px;' class="center">
                        <div style='float: left;'><img src='img/${classroomParams[currTrial.classroomPairing[0]].a}orange${classroomParams[currTrial.classroomPairing[0]].b}purple.png' width="400"></img>
                        <p class='small'><strong>${classroomParams[currTrial.classroomPairing[0]].a + classroomParams[currTrial.classroomPairing[0]].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[currTrial.classroomPairing[0]].a}</b> ${classroomParams[currTrial.classroomPairing[0]].a === 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.classroomPairing[0]].b}</b> ${classroomParams[currTrial.classroomPairing[0]].b === 1 ? 'is' : 'are'} purple</strong></p></div>
                        <div style='float: right;'><img src='img/${classroomParams[currTrial.classroomPairing[1]].a}orange${classroomParams[currTrial.classroomPairing[1]].b}purple.png' width="400"></img>
                        <p class='small'><strong>${classroomParams[currTrial.classroomPairing[1]].a + classroomParams[currTrial.classroomPairing[1]].b}</b> turtles, \
                            of which <b style="color:Orange;">${classroomParams[currTrial.classroomPairing[1]].a}</b> ${classroomParams[currTrial.classroomPairing[1]].a === 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.classroomPairing[1]].b}</b> ${classroomParams[currTrial.classroomPairing[1]].b === 1 ? 'is' : 'are'} purple</strong></p></div>
                        </div>

                        <ul style="color:Tomato; display: inline-block; text-align: left;">
                        ${firstResponse.condition === "seqFeedback" ? `<li>Your student's <b>first guess</b> was that <b style="color:Orange;">${Math.round(firstResponse.studentGuess * 100)}</b> out of every 100 turtles are \
                            orange and <b style="color:Purple;">${Math.round((1 - firstResponse.studentGuess).toFixed(2) * 100)}</b> out of every 100 turtles are purple.</li>` : ''}
                        </ul>

                        <p>Select another set of turtles to show your student.</p>
                `},
        html: `
                <p> <input name="heads" type="number" required="true" min="0" max="${params.maxExamples}" value="0"/> <b style="color:Orange;">orange</b> turtles  </p>
                <p> <input name="tails" type="number" required="true" min="0" max="${params.maxExamples}" value="0"/> <b style="color:Purple;">purple</b> turtles  </p>`,
        button_label: 'Send turtles to student',
        data: {
            type: 'response',
            condition: currTrial.condition,
            trueTheta: currTrial.coinWeight,
            classrooms: currTrial.classroomPairing,
            studentTrueClassroom: studentTrueClassroom,
            exampleSet: 'second'
        },
        on_load: function () {
            var start_time = performance.now();
            console.log(start_time)
            end_test_timer = jsPsych.pluginAPI.setTimeout(function () {
                var end_time = performance.now();
                var elapsed_time = end_time - start_time;
                console.log("elapsed time: ", elapsed_time);

                jsPsych.finishTrial({ status: 'timeout' });
            }, 90000)
        },
        on_finish: function (data) {

            jsPsych.pluginAPI.clearAllTimeouts();

            var dataSoFar = jsPsych.data.get()
            var firstResponse = dataSoFar.filter({ studentIndex: i, exampleSet: 'first' }).values()[0]

            var firstResponseHeads = firstResponse.heads;
            var firstResponseTails = firstResponse.tails;

            if (data.response != null) { // if timeout... (technically you can put this in the place where you call the timeout too)
                var nHeads = parseInt(data.response.heads);
                var nTails = parseInt(data.response.tails);
            } else {
                var nHeads = 0;
                var nTails = 0;
            }

            var totalHeads = firstResponseHeads + nHeads;
            var totalTails = firstResponseTails + nTails;
            var studentTrueHypers = classroomParams[data.studentTrueClassroom];
            var studentGuess = ((parseInt(studentTrueHypers.a) + totalHeads) / (parseInt(studentTrueHypers.a) + parseInt(studentTrueHypers.b) + totalHeads + totalTails)).toFixed(2);
            var delta = Math.abs(data.trueTheta - studentGuess);
            var reward = delta <= params.perTrialBonusThreshold + 0.001 ? params.perTrialBonus : 0
            var cost = params.exampleCost * (totalHeads + totalTails)

            data.firstResponseHeads = firstResponseHeads;
            data.firstResponseTails = firstResponseTails;
            data.secondResponseHeads = nHeads;
            data.secondResponseTails = nTails;
            data.totalHeads = totalHeads;
            data.totalTails = totalTails;
            data.studentIndex = i;
            data.studentTrueHypers = studentTrueHypers;
            data.studentGuess = studentGuess;
            data.delta = delta;
            data.bonus = Number((((reward - cost) > 0) && (firstResponseHeads + firstResponseTails > 0) && (nHeads + nTails > 0)) ? (reward - cost).toFixed(2) : 0);
            data.bonusSoFar = Number(dataSoFar.select('bonus').sum().toFixed(2))
            data.totalExamples = totalHeads + totalTails;
        }
    };

    var secondExampleLoop = {
        timeline: [secondExample],
        loop_function: function (data) {

            var totalFlips = parseInt(data.values()[0].secondResponseHeads) + parseInt(data.values()[0].secondResponseTails)

            if (totalFlips <= params.maxExamples) {

                return false; // proceed
            } else {
                return true;
            }
        }
    }

    var sent = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Turtles sent to student! Waiting for student...',
        choices: "NO_KEYS",
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([4000, 4500, 5000], 1)[0];
        }
    }

    var finalSequentialFeedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {

            var dataSoFar = jsPsych.data.get()

            var firstResponse = dataSoFar.filter({ studentIndex: i, exampleSet: 'first' }).values()[0]
            var secondResponse = dataSoFar.filter({ studentIndex: i, exampleSet: 'second' }).values()[0]

            return `
                ${(firstResponse.totalExamples == 0) || (secondResponse.secondResponseHeads + secondResponse.secondResponseTails == 0) ? `<p style="color:Red;">You could not receive a bonus for this student because you failed to send turtles for both lessons. Make sure to send at least one turtle for both lessons next time!</p>` : ''}
                <p>Time to move on to the next student! Press any key to continue.</p>
                `
        },
        trial_duration: 20000
    }

    var fixation = {
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
            if (i === design.length - 1) {
                return false;
            } else {
                return true;
            }
        }
    }

    const trialsInCondition = {
        'nonSeqFull': [classroomInfo, firstExampleLoop, sending, sent, feedback, fixation],
        'nonSeqPartial': [classroomInfo, firstExampleLoop, sending, sent, feedback, fixation],
        'seqNoFeedback': [classroomInfo, firstExampleLoop, sending, sent, secondExampleLoop, sending, sent, finalSequentialFeedback, fixation],
        'seqFeedback': [classroomInfo, firstExampleLoop, sending, sent, feedback, secondExampleLoop, sending, sent, finalSequentialFeedback, fixation],
    }

    // timeline.push(trialsInCondition[currTrial.condition])

    // Add attention check
    if (attention_locations.includes(i)) {
        // timeline.push(jsPsych.randomization.sampleWithoutReplacement(attention_trials, 1)[0]);
        // timeline.push([sending, sent, fixation])
    }
}

