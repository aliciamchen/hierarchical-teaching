var instructions = {
    type: jsPsychInstructions,
    pages: [
        `<p>
        Please read the following instructions carefully as there will be a comprehension quiz.
        If your answers on the comprehension quiz indicate that you have not read the 
        instructions, we will repeat them.
        </p>`,

        `<p>
        You have just landed on a new archipelago, consisting of many different islands. 
        You’re there to study the famous rainbow turtles. 
        </p>
        <div class="center" style="margin-bottom:1em;">
            <img src='img/archipelago.png' width="600"></img>
        </div>
        <p>
        You’ve heard that some turtles are purple and some are orange but you don’t know which 
        is more common. You’d like to learn what percentage of turtles have each color. 
        </p>`,

        `<p>
        Luckily, some local residents have agreed to help show you around a total of 
        ${params.nTrials} different islands. When you arrive on a new island, you will be matched 
        with two different teachers. </p>
        <!-- insert a teacher image here maybe? -->
        <p>
        Both teachers know where all the turtles on the island live and how many of them 
        are orange compared to purple. They will <b>take you to see the turtles that 
        live in exactly one region of the island</b> to help you learn. 
        </p>`,

        `<p>
        The two teachers will start by each showing you a certain 
        number of orange and purple turtles.
        </p>
        <p>
        Then, you will select which teacher you prefer to learn from.
        </p>`,

        `<p>
        Once you have selected a teacher, you will be asked to guess the island’s 
        actual turtle composition. You will be prompted to enter the number of orange 
        and purple turtles you expect to see out of every 100 turtles.
        </p>`,

        `<p>
        After you select a teacher and make a guess, you will be shown the ‘right answer’ — 
        the percentage of orange and purple turtles that actually live on the island. 
        </p>`,

        `<p>
        <h3>Note:</h3> For some of the islands, you will have already explored a small part 
        of the island, where you will have seen a certain number of orange and purple turtles 
        before encountering the teachers. The teachers will know which part of the island you 
        have explored and will use this information to show you turtles from other parts of 
        the island.
        </p>`,

        `<p>
        Finally, after being shown the ‘right answer,’ you will choose the teacher that 
        you believe is better!
        </p>`,

        `<p>
        Then the block will end and you will move on to the next block, where you will 
        encounter two new teachers on a completely new island.
        </p>`,

        `<h2>How to earn a bonus</h2>
        <p>
        As the experiment is going on, each teacher will encounter many other students. 
        Some teachers are better at teaching, and some are worse at teaching. We will assign 
        each teacher a score based on how good they were at teaching during the task. You 
        will earn a bonus of up to $${params.maxBonus}, based on whether the teachers you select 
        are actually better teachers!
        </p>`,

        `<h2>Review</h2>
        <ul>
            <li>You will first select one of the two teachers to learn from.</li>
            <li>Using the teachers’ examples, you will guess what the island composition is.</li>
            <li>After you make the guess, you will be shown the true island 
                composition — the ‘correct answer’</li>
            <li>Finally, based on this true proportion, you will reassess 
                which teacher you prefer.</li>
        </ul>`,
    ],
    show_clickable_nav: true,
    show_page_number: true
};

var comprehensionCheck = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: `Is there a difference in how much the <b>two teachers for each block</b>
                    know about you? `,
            options: [
                'Both teachers know the same amount of information about me.',
                'Both teachers know nothing about me.',
                `One teacher sometimes knows more about me than the other.`
            ],
            required: true
        },
        {
            prompt: 'Will you ever encounter the same teacher in two different blocks?',
            options: [
                'Yes, I can sometimes encounter the same teacher twice.',
                `No – even if the examples look familiar, I’ll always be learning from a 
                new teacher.`
            ],
            required: true
        },
        {
            prompt: `Before being shown teachers’ examples, you will see:`,
            options: [
                'The turtle composition of the island.',
                'A few turtles.',
                'Either a few turtles or no turtles.'
            ],
            required: true
        },
        {
            prompt: `How can you earn a high performance bonus?`,
            options: [
                `By consistently choosing the best teachers during the reassessment stage. .`,
                `By randomly selecting teachers.`
            ],
            required: true
        }
    ],
    randomize_question_order: true,

    on_finish: function (data) {
        data.pass = [data.response.Q0.includes('same'), 
                    data.response.Q1.includes('familiar'), 
                    data.response.Q2.includes('or'), 
                    data.response.Q3.includes('best')].every(Boolean)
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

var seqInstructions = {
    type: jsPsychInstructions,
    pages: [
        `<b>Instructions Part 2</b>`,

		`<p>
		Please read these instructions carefully, as there will be a short 
		comprehension quiz afterwards.
        </p>`,

        `<p>
        A ferry full of new teachers has arrived on the archipelago. 
        </p>`,

		`<p>
        You will again be matched with two teachers per block, and your goal is still 
		the same — to select the teacher you prefer.
        </p>`,

		`<p>
		You will have <b>already explored a small part of each island, where you will have 
		seen a certain number of orange and purple turtles</b> before encountering the teachers.
        </p>`,

		`<p>
		This time, the teachers will <b>not</b> know which part of the island you have explored. 
		However, teachers </b>will see your guess</b> after you provide a guess. Then, they will 
		send you additional turtles based on this guess.
		</p>`,

		`<p>
		Then, you will select the teacher you would most like to learn from.
		</p>`,

		`<p>
		You will receive a bonus based on the same criteria as the previous part of the study — 
		by selecting the best teacher. 
		</p>`,

        `<h2>Review</h2>
        <ul>
            <li>The teachers do <b>not</b> know how many turtles of each color you have seen.</li>
            <li>The turtles you have seen are <b>not necessarily representative</b> of 
				the island’s composition</li>
            <li>Since the teachers are aware of this, they will try to <b>correct your 
				initial impressions</b>.</li>
            <li>Using the teachers’ examples and the turtles you have already seen, you will 
				guess what the true island proportion is.</li>
			<li>After you make a guess, the teachers will see your guess and then 
				show you more examples.</li>
			<li>Alongside these updated examples, you will be shown the true 
				island composition.</li>
			<li>Finally, based on the true proportion and updated examples, you will 
				reassess which teacher you prefer.</li>
        </ul>`,
    ],
    show_clickable_nav: true,
    show_page_number: true
};

var seqComprehensionCheck = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: `What do the teachers already know about you?`,
            options: [
                'They will know which part of the island I have explored and how many orange and \
				purple turtles I have seen.',
                'They will <b>not</b> know which part of the island I have explored and how \
				many orange and purple turtles I have seen.'
            ],
            required: true
        },
        {
            prompt: 'What information will the teachers get about you after you give them \
					your guess?',
            options: [
                'They will see my guess for the proportion of orange and purple turtles on \
				the island. ',
                `They will see how many orange and purple turtles I have already seen \
				on the island.`
            ],
            required: true
        }
    ],
    randomize_question_order: true,

    on_finish: function (data) {
        data.pass = [data.response.Q0.includes('not'), 
                    data.response.Q1.includes('proportion')].every(Boolean)
    }
};

var seqComprehensionLoop = makeLoop('comprehension', [seqInstructions,seqComprehensionCheck,fail]);