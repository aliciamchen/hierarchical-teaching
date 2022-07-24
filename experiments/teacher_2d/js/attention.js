
// Make attention check

var attention_locations = [3, 9, 13];
var attention_params = [[70, 0], [35, 35], [0, 70]]; // turtle breakdown options
var attention_trials = [];

for (let i = 0; i < attention_locations.length; i++) {

    // randomly sample from design params for attention check
    var currTrial = jsPsych.randomization.sampleWithoutReplacement(design, 1)[0];

    var classroomInfo = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <h4 style="color:Blue;">New student</h4>
            <h2>On this island, <b style="color:Orange;">${currTrial.coinWeight * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - currTrial.coinWeight).toFixed(1) * 10}</b> out of every 10 turtles are purple.</h2>
            `,
        choices: ['Continue']
    }

    var attention = {
        type: jsPsychSurveyHtmlForm,
        preamble: `
                <h4 style="color:Blue;">New student</h4>
                <h3><b>This page is an attention check and does not count toward your bonus.</b></h3>
                ${currTrial.condition === 'nonSeqFull' ? `
                        <h2>On this island, <b style="color:Orange;">${currTrial.coinWeight * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - currTrial.coinWeight).toFixed(1) * 10}</b> out of every 10 turtles are purple.</h2>
                        <h3 style="color:DodgerBlue;">Student info</h3>
                        <p style="color:DodgerBlue;text-align:center">
                            Student ${i + 1} has already seen \
                        <b>${classroomParams[currTrial.trueClassroom].a + classroomParams[currTrial.trueClassroom].b}</b> turtles, \
                        of which <b style="color:Orange;">${classroomParams[currTrial.trueClassroom].a}</b> ${classroomParams[currTrial.trueClassroom].a == 1 ? 'is' : 'are'} orange \
                            and <b style="color:Purple;">${classroomParams[currTrial.trueClassroom].b}</b> ${classroomParams[currTrial.trueClassroom].b == 1 ? 'is' : 'are'} purple.
                        </p>

                        <div class="center" style="margin-bottom:1cm;">
                        <div><img src='img/${classroomParams[currTrial.trueClassroom].a}orange${classroomParams[currTrial.trueClassroom].b}purple.png' width="400"></img>
                        </div>
                        </div>

                        <p><b>Select <b style="color:Orange;">${attention_params[i][0]}</b> orange and <b style="color:Purple;">${attention_params[i][1]}</b> purple turtles to send to your student.</b></p>
                        <p>You must pass all attention checks to have your HIT accepted.</p>
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
                        </br>

                        <p><b>Select <b style="color:Orange;">${attention_params[i][0]}</b> orange and <b style="color:Purple;">${attention_params[i][1]}</b> purple turtles to send to your student.</b></p>
                        <p>You must pass all attention checks to have your HIT accepted and collect the base pay.</p>
                        `
            }`
        ,
        html: `
                <p> <input name="heads" type="number" required="true" min="0" max="${params.maxExamples}" value="0"/> <b style="color:Orange;">orange</b> turtles </p>
                <p> <input name="tails" type="number" required="true" min="0" max="${params.maxExamples}" value="0"/> <b style="color:Purple;">purple</b> turtles </p>`,
        button_label: 'Send turtles to student',
        data: {
            type: 'attention',
            condition: currTrial.condition,
            trueTheta: currTrial.coinWeight,
            classrooms: currTrial.classroomPairing,
            attention_params: attention_params[i]
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


            data.heads = nHeads;
            data.tails = nTails;
            data.totalExamples = nHeads + nTails;
            // console.log(data.attention_params)
            // console.log((data.params[0] == nHeads) && (data.params[1] == nTails)) // attention check debugging

            data.passAttentionCheck = (data.attention_params[0] == nHeads) && (data.attention_params[1] == nTails);
            console.log((data.attention_params[0] == nHeads) && (data.attention_params[1] == nTails))
        }
    };

    attention_trials.push([classroomInfo, attention]);
}