const params = {
    nStudents: 16,
    maxExamples: 70,
    completionMinutes: 30,
    basePay: 5,
    maxBonus: 12,
    perTrialBonus: 0.7,
    perTrialBonusThreshold: 0.08,
    exampleCost: 0.01
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
    },
    timing_post_trial: 0
};



/* Experiment */


var timeline = [];

var preload = {
    type: jsPsychPreload,
    images: ['img/1orange9purple.png', 'img/9orange1purple.png']
};

timeline.push(preload);


// Welcome and introduction

var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Welcome to the experiment. Press any key to begin.',
    trial_duration: 10000
}

timeline.push(welcome);

var consent = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <h3>Please read this consent agreement carefully before deciding whether to participate in this experiment.</h3>
        <p><b>Purpose of the research:</b> To examine how people teach effectively.</p>
        <p><b>What you will do in this research:</b> You will teach students the turtle composition of different islands.</p>
        <p><b>Time required:</b> This experiment will take ${params.completionMinutes} minutes to complete.</p>
        <p><b>Risks:</b> There are no anticipated risks associated with participating in this study. \
            The effects of participating should be comparable to those you would experience from viewing a computer monitor \
            and using a mouse and keyboard for the duration of the experiment.</p>
        <p><b>Benefits:</b> The study provides important information about the nature of teaching.</p>
        <p><b>Compensation:</b> You will receive <b>$${params.basePay}</b> for completing the experiment and a performance bonus of up to <b>$${params.maxBonus}</b>.</p>
        <p><b>Confidentiality:</b> Your participation in this study will remain confidential. \
            No personally identifiable information will be associated with your data. \
            Your de-identified data may be shared with other researchers and used in future projects.</p>
        <p><b>Participation and withdrawal:</b> Your participation in this study is completely voluntary and \
            you may refuse to participate or you may choose to withdraw at any time without penalty or loss of
            benefits to which you are otherwise entitled.</p>
        <p><b>How to contact the researcher:</b> If you have questions or concerns about your participation\
            or payment, or want to request a summary of research findings, please contact
            Alicia Chen, aliciachen@college.harvard.edu.</p>
        <p><b>Whom to contact about your rights in this research:</b> For questions, concerns, suggestions, \
            or complaints that have not been or cannot be addressed by the researcher, or to report \
            research-related harm, please contact the Committee on the Use of Human Subjects in Research at Harvard University, \
            1414 Massachusetts Avenue, Second Floor, Cambridge, MA 02138. Phone: 617-496-2847. Email: cuhs@fas.harvard.edu.</p>
        `,
    choices: ['I consent']
};

timeline.push(consent);

var instructions = {
    type: jsPsychInstructions,
    pages: [
        `<p>Please read the following instructions carefully as there will be a comprehension quiz. \
            If your answers on the comprehension quiz indicate that you have not read the instructions, \
            we will repeat them.</p>`,

        `<p>You are a teacher. You will be paired with students and your goal is to teach effectively.</p>`,

        `<p>You have just landed on a new archipelago, consisting of many different islands. \
            Each island has a certain composition of <b style="color:Orange;">orange turtles</b> and <b style="color:Purple;">purple turtles</b>, all hidden around the island.</p>`,

        `<p>You will be teaching a total of ${params.nStudents} students.</p>
            <p>For each student, you will be shown a <b>new island</b> and we will tell you the turtle composition of the island: the <b>actual</b> \
                proportion of <b style="color:Orange;">orange</b> and <b style="color:Purple;">purple</b> turtles \
                that live on the island.</p>
            <p>The student won't know this information. Your goal is to give the student new information \
                to <b>lead them to the actual turtle composition of the island.</b><p>`,

        `<h3>What kind of information can I give to my students to lead them to the correct answers?</h3>
            <p>You can only give information to students by <b>showing them new turtles selectively drawn from different parts of the island.</b> The students will be led around the island to see the turtles you have selected for them.</p>
            <p>You know where all the turtles live on the island!</p>
            <p>So you can choose the number of <b style="color:Orange;">orange</b> and <b style="color:Purple;">purple</b> turtles to show to each student. This proportion does not have to correspond to the island's actual turtle composition.</p>`,

        `<h2 style="color:Tomato;">Important</h2>
            <p>The turtles you show your students are not the first turtles they have seen on the island!</p>
            <p>Each student already has some island experience: they have <b>already</b> wandered a bit around the island, where they have seen a selection of orange and purple turtles.</p>
            <p>However, because they don't know where all the turtles live, the turtles they have seen are <b>not necessarily representative</b> of the island's actual turtle composition. \
                <b style="color:Tomato;">By showing the student more turtles from the island, your job is to correct these initial impressions.</b></p>
            <div class="center" style="margin-bottom:1cm;">
            <div><img src='img/turtles_paths.png' width="600"></img>
            </div>
            </div>
                `,

        `<p>So for each student, your goal is to show them <b>more</b> turtles from the island to help them figure out the island's actual turtle composition.</p>
            `,

        `<h2>Two groups of students</h2>
            <p>Before interacting with you, each student belonged to one of two groups. The two groups have wandered around different parts of the island, where they have already seen a number of orange and purple turtles.</p>
            <br>
            <div style='width: 900px; overflow: hidden;' class="center">
                <div style='float: left;'><img src='img/9orange1purple.png' width="400"></img></div>
                <div style='float: right;'><img src='img/1orange9purple.png' width="400"></img>
            </div>
            </div>
            </br>

            <p>For some students, you might not know which group they belonged to.</p>
            <p>Every time you encounter a new student, you will be given information about their past experience wandering around the island. We will display this information in <b style="color:DodgerBlue;">blue</b>.</p>
            <p><b style="color:Tomato;">To teach effectively, you will want to consider how a student's experience affects \
                how they interpret the additional turtles you send to them.</b></p>`,

        `<p>You will teach each student over either one or two lessons (we will tell you how many lessons to expect each time you encounter a new student). \
                During each lesson, you can show up to <b>${params.maxExamples}</b> turtles to the student.</p>`,

        `<h3>How can I earn as much money as possible from this experiment?</h3>
            <p>You will want to teach <b>helpfully</b> and <b>efficiently</b>.</p>
            <p>As the experiment is going on, your students will guess the turtle compositions of each island (by entering the proportion of orange and purple turtles they expect to see out of 100 turtles). \
                In addition to the base pay of <b>$${params.basePay}</b>, for each student you will earn an extra <b>$${params.perTrialBonus.toFixed(2)}</b> if their guess is within <b>${params.perTrialBonusThreshold * 100}</b> turtles of the actual turtle breakdown.</p>
            <p>(For the students that you'll teach over two lessons, you will a receive a bonus based on the student's <b>final</b> guess, which takes into consideration the turtles you have \
                shown them for <em>both</em> lessons.)</p>.`,

        `<h3>How can I earn as much money as possible from this experiment?</h3>
            <p>However, each turtle that you show a student <em>costs</em> <b>$${params.exampleCost}</b>. (For example, all else being equal, walking around the island to show a student 20 turtles costs more than walking around the island to show 10 turtles.)</p>
            <p>(Don't worry, <b>you can't lose money for each student</b>. And for each student, \
                turtles only cost money if you earned a bonus for that student.)</p>
            <p><b>Make sure to click "Send" to submit a set of turtles during every lesson.</b> You have 90 seconds to send your turtles for each lesson. If you don't submit a response within the 90 seconds, or if you don't send any turtles to your student, \
                you <b>cannot earn a bonus for that student</b>.</p>
            <p>We will tell you how much bonus you have earned at the end of the study!</p>
            <p style="color:Tomato;">On to the comprehension quiz! Feel free to flip back and forth in the instructions before pressing "Next" to proceed to the quiz.</p>
            `
    ],
    show_clickable_nav: true,
    show_page_number: true
};


var comprehensionCheck = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: `What are the differences between different students' past island experience?`,
            options: [
                'Students will have seen a different number of orange and purple turtles from the island before seeing the new turtles you show them.',
                'Students will have seen a bunch of different types of islands before seeing the new turtles you show them.',
                `All students' experience is the same, so I will treat all students the same.`
            ],
            required: true
        },
        {
            prompt: 'How can you earn a high performance bonus?',
            options: [
                'By showing my students as few turtles as possible.',
                `By not considering what my students have already seen on the island, and instead showing my students ${params.maxExamples} turtles (the maximum) on each lesson so I can make sure that the students' guesses are as accurate as possible.`,
                `By considering what my students have already seen on the island so that I can correct their assumptions about the island and teach efficiently and accurately/helpfully at the same time.`
            ],
            required: true
        },
        {
            prompt: `Is there a chance you'll encounter the same student twice (not including the students you'll teach over two lessons)?`,
            options: [
                'Yes, I might encounter the same student twice.',
                'No, I will teach a <b>new</b> student each time.'
            ],
            required: true
        },
        {
            prompt: `For the students to whom I'll show two sets of turtles (over two lessons), how will my bonus be calculated?`,
            options: [
                `Based on the student's first guess.`,
                `Based on the student's second (and final) guess.`,
                'Based on both guesses.'
            ],
            required: true
        },
        {
            prompt: `How will new turtles be shown to my students?`,
            options: [
                'The students will be walked around the island until they see the number of new orange and purple turtles I select for them.',
                'The new turtles will be shown to the student as a random sample from the island.',
                'The new turtles will appear out of thin air.'
            ],
            required: true
        }
    ],
    randomize_question_order: true,

    on_finish: function (data) {
        data.pass = [data.response.Q0.includes('orange'), data.response.Q1.includes('time'), data.response.Q2.includes('new'), data.response.Q3.includes('final'), data.response.Q4.includes('walked')].every(Boolean)
    }
}


var fail = {
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: `Oops, you have missed question(s) on the comprehension check! We'll show you the instructions again.`,
        choices: ["Got it!"]
    }],
    conditional_function: function () {
        const responses = jsPsych.data.getLastTrialData();
        return !responses.select("pass").values[0];
    }
};

var comprehensionLoop = {
    timeline: [instructions, comprehensionCheck, fail],
    loop_function: function (data) {
        return !data.select("pass").values[0];
    }
};

timeline.push(comprehensionLoop);


/* Main logic of trials */

var design = jsPsych.randomization.factorial(factors, 1);

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

timeline.push(beginning, firstStudentWarning);


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
            params: attention_params[i]
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
            data.passAttentionCheck = (data.params[0] == nHeads) && (data.params[1] == nTails);
        }
    };

    attention_trials.push([classroomInfo, attention]);
}



// Loop through individual trials in design to create timeline
for (let i = 0; i < design.length; i++) {

    var currTrial = design[i];
    var studentTrueClassroom = currTrial.trueClassroom // could pass this in directly but this is quick change from before when it was randomized

    var classroomInfo = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <h4 style="color:Blue;">Student ${i + 1}</h4>
            <h2>On this island, <b style="color:Orange;">${currTrial.coinWeight * 10}</b> out of every 10 turtles are orange and <b style="color:Purple;">${(1 - currTrial.coinWeight).toFixed(1) * 10}</b> out of every 10 turtles are purple.</h2>
            <p>In this block, you will be teaching ${currTrial.condition === 'nonSeqPartial' || currTrial.condition === 'nonSeqFull' ? '<b>one</b> lesson' : '<b>two</b> lessons'} to Student ${i + 1}.</p>
            <p>${currTrial.condition === 'seqFeedback' ? `<b>You will see the student's guess after the first lesson.</b>` : ''} ${currTrial.condition === 'seqNoFeedback' ? `You will <b>not</b> see the student's guess after the first lesson.` : ''}</p>
            <p>${currTrial.condition == 'seqFeedback' ? `To earn the highest bonus, you will have to <b>take into consideration the student's guess</b> when you choose your second set of turtles.` : ''}</p>`,
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

    timeline.push(trialsInCondition[currTrial.condition])

    // Add attention check
    if (attention_locations.includes(i)) {
        timeline.push(jsPsych.randomization.sampleWithoutReplacement(attention_trials, 1)[0]);
        timeline.push([sending, sent, fixation])
    }
}




var survey = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <p>You have reached the end of the experiment! To collect your bonus, please complete the following questions. </p>
        `,
    html:
        '<p><div style="margin-left:0%;text-align: left">Which gender do you most identify with?</div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice1" name="gender" value="male"><label for="genderChoice1">Male</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice2" name="gender" value="female"><label for="genderChoice2">Female</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice3" name="gender" value="nonconforming"><label for="genderChoice3">Gender Variant/Non-Conforming</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="genderChoice4" name="gender" value="abstain" required><label for="genderChoice4">Prefer not to answer</label></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"><label for="age">Enter your age:</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="text" id="age" name="age" required></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"> Did you understand the instructions?</div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="understoodChoice1" name="understood" value="yes" required><label for="understoodChoice1">Yes</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="radio" id="understoodChoice2" name="understood" value="no"><label for="understoodChoice2">No</label></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"><label for="strategy">What was the strategy you used?</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="text" id="strategy" name="strategy"></div></p>' +
        '<p><div style="margin-left:0%;text-align: left"><label for="comments">Comments or suggestions?</label></div>' +
        '<div style="margin-left:0%;text-align: left"><input type="text" id="comments" name="comments"></div></p>'
    ,
    button_label: ['Continue, save data, and collect bonus!'],
    data: { type: 'response' },
    on_finish:
        function (data) {
            var totalBonus = jsPsych.data.get().select('bonus').sum().toFixed(2);
            data.totalBonus = Number(totalBonus);
            data.passAttentionChecks = jsPsych.data.get().select('passAttentionCheck').sum() == 3 ? true : false
        },
}

timeline.push(survey);

if (!local_testing) {
    timeline.push(save_data);
}

var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {

        var totalBonus = jsPsych.data.get().select('bonus').sum().toFixed(2);
        var totalPay = Number(totalBonus) + Number(params.basePay);
        return `
                <p>Thanks for participating in the experiment!</p>
                <p>Your total bonus is <b>$${totalBonus}</b>.</p>
                <p>Your total pay is <b>$${totalPay}</b></p>
                <p>If you were curious, you weren't interacting with a real learner.</p>
                <p>Press any key to exit and collect your bonus.</p>
                <p>After you exit, it is safe to close the screen and your responses will be saved automatically.</p>
                `;

    }
};

timeline.push(debrief_block);

jsPsych.run(timeline.flat());
