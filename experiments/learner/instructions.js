var instructions = {
    type: jsPsychInstructions,
    pages: [
        `<p class="instruction">
        Please read the following instructions carefully as there will be a comprehension quiz.
        If your answers on the comprehension quiz indicate that you have not read the 
        instructions, we will repeat them.
        </p>`,

        `<p class="instruction">
        You have just landed on a new archipelago, consisting of many different islands. You're 
        there to study the famous rainbow turtles. 

        You've heard that on some islands, purple turtles are more common, and on others, orange 
        turtles are more common. You'd like to learn what sort of island each island is.
        </p>`,

        `<p class="instruction">
        Interestingly enough, all the islands have 7 out of 10 turtles in the <b>majority color</b> 
        and 3 out of 10 turtles in the <b>minority color</b>. However, you don't know what 
        the majority and minority colors are on each island!
        </p>
        <p class="instruction">
        So, each island is either:
        </p>
        <ul>
            <li><b>majority-purple</b>, with 7 out of 10 purple turtles and 3 out 
            of 10 orange turtles, or</li>
            <li><b>majority-orange</b>, with 3 out of 10 purple turtles and 7 out of 
            10 orange turtles.</li>
        </ul>
        <div class="center" style="margin-bottom:1em;">
            <img src='img/archipelago.png' width="600"></img>
        </div>
        <p class="instruction">
            Your goal is to <b>determine whether each island is 
            majority-purple or majority-orange.</b>
        </p>`,
 
        `<h4>How will I learn about each island?</h4>
        <p class="instruction">
        Some local residents luckily have agreed to help show you around a total of 
        ${params.nTrials} different islands. Every time you arrive on a new island, you will 
        be matched with a new teacher.
        </p>
        <!-- insert a teacher image here maybe? -->
        <p class="instruction">
        This teacher knows where all the turtles on the island live and how many of them 
        are orange compared to purple. They will <b>take you to see turtles that live in 
        distinct regions of the island</b> to help you learn.  
        </p>
        <p class="instruction">
        So the teacher will give you information to <b>help you figure out whether each 
        island is majority-purple or majority-orange.</b> Each teacher will show you <b>two 
        sets</b> of orange and purple turtles from the island.   
        </p>
        <p class="instruction">
        At the end of each block, you will guess whether the island is 
        majority-purple or majority-orange. You will receive a bonus each time you 
        successfully guess the island type!   
        </p>`,

        `<p class="instruction">
        <b>Before</b> the teacher begins to show you around each island, you will 
        <b>have already come across ten orange and purple turtles on the island.</b>
        On some of these islands, nine out of the ten turtles you come across will be orange. 
        On some other islands, nine out of the ten turtles you come across will be purple. 
        We will give you this information every time you arrive on a new island.
        </p>
        <p class="instruction">
        Sometimes, the teacher will know exactly which turtles you have seen, but other times 
        they will be uncertain <b>as to whether you saw 9 orange turtles or 9 purple turtles 
        out of 10 turtles.</b>
        </p>
        <p class="instruction">
        <b>We won't tell you</b> whether the teacher <b>knows or doesn't know</b> 
        what you have already seen. 
        </p>`,

        `<p class="instruction">
        All teachers will teach through two rounds.
        </p>`,

        `<h3 class="instruction">Lesson 1</h3>
        <p class="instruction">
        Based on their knowledge of what you have seen, on the first round the teacher will 
        show you an additional number of orange and purple turtles from the island to help 
        you learn which type of island you are on. 
        </p>
        <p class="instruction">
        Using these examples, you will use a slider to guess whether <b>the teacher 
        knew what turtles you initially saw.</b>
        </p>
        <p class="instruction">
        Then, you will have an option to send information to the teacher. You can select 
        whether you would like to <b>enter a guess for the island type</b> and send it 
        to the teacher.
        </p>
        <p class="instruction">
        If you send a guess, the teacher will consider this guess when showing you 
        the second set of turtles. 
        </p>`,

        `<h3 class="instruction">Lesson 2</h3>
        <p class="instructions">
        In this round, the teacher will <b>send you a second set of example turtles.</b>
        </p>
        <p class="instruction">
        Then, you will enter your final guess for what type of island you are on 
        (<b>majority-orange</b> or <b>majority-purple</b>).
        </p>`,

        `<p class="instructions">
        Then the block will end and you will move on to the next block, 
        where you will encounter a new teacher on a <em>completely new island.</em>
        </p>`,

        `<h3>How to earn a bonus</h3> 
        <p class="instruction">
        Every time you select the correct island <b>during the final lesson</b>, you will 
        earn a bonus of $${params.perTrialBonus.toFixed(2)}. 
        </p>
        <p class="instruction">
        Sending feedback to the teacher costs money: every time you send feedback 
        to the teacher, $${params.feedbackCost.toFixed(2)} will be subtracted from your bonus.  
        </p>`,

        `<h2>Review</h2>
        <h4>Lesson 1</h4>
        <ul>
            <li>You will come across some turtles, then see additional example 
            turtles from a teacher</li>
            <li>After seeing the examples, you will guess whether the teacher 
            knows which turtles you saw at first</li>
            <li>You will decide whether or not to send a guess to the teacher</li>
        </ul>
        <h4>Lesson 2</h4>
        <ul>
            <li>The teacher will send you <b>another</b> set of examples</li>
            <li>Based on all of the turtles you have seen, you will guess what island type 
            you are on (majority-orange or majority-purple)</li>
            <li>Your bonus will be based on this final guess, minus a cost if you 
            previously sent the teacher information</li>
        </ul>`,
    ],
    show_clickable_nav: true,
    show_page_number: true
};

var comprehensionCheck = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: `What do the teachers know about you?`,
            options: [
                `The teacher always knows the turtles I have seen.`,
                `The teacher either knows the turtles I have seen, or is uncertain as to \
                the turtles I've seen.`,
                `The teacher is always uncertain as to what turtles I have seen.`
            ],
            required: true
        },
        {
            prompt: 'Will you ever encounter the same teacher for two different islands?',
            options: [
                `Yes, I can sometimes encounter the same teacher twice.`,
                `No: even if the examples look familiar, I'll always be learning from a 
                new teacher.`
            ],
            required: true
        },
        {
            prompt: `Before being shown teachers' examples, you will see:`,
            options: [
                'The turtle composition of the island.',
                'Some turtles.',
                'Either some turtles or no turtles.'
            ],
            required: true
        },
        {
            prompt: `How is your performance bonus determined?`,
            options: [
                `Based on my final guess and whether I sent feedback.`,
                `Based on all of my guesses.`,
                `Based on my classification of the teacher.`
            ],
            required: true
        },
        {
            prompt: `How are different islands different?`,
            options: [
                `All the islands have 7 out of 10 of one color of turtle and 3 out of \
                10 of another color of turtle.`,
                `All of the islands can have any number of orange and purple turtles.`,
                `All of the islands have a turtle composition of 7 out of 10 orange turtles.`
            ],
            required: true
        }
    ],
    randomize_question_order: true,

    on_finish: function (data) {
        data.pass = [data.response.Q0.includes('either'), 
                    data.response.Q1.includes('familiar'), 
                    data.response.Q2.includes('Some turtles.'), 
                    data.response.Q3.includes('final'),
                    data.response.Q4.includes('another')].every(Boolean)
    }
};


var fail = {
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: `Oops, you have missed question(s) on the comprehension check! \
                    We'll show you the instructions again.`,
        choices: ["Got it!"]
    }],
    conditional_function: function () {
        const responses = jsPsych.data.getLastTrialData();
        return !responses.select("pass").values[0];
    }
};

var comprehensionLoop = makeLoop('comprehension', [instructions, comprehensionCheck, fail]);