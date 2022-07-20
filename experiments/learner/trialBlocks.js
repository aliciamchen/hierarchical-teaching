function firstExamples (i, currTrial) {
	return `
	<h4 style="color:Blue;">Welcome to Island ${i + 1}!</h4>
	${currTrial.condition !== 'nonSeqNoPrior' ?
	`<h4>Upon arriving, you wander around one part of the island, where you saw 
	${ex_to_text(hyperParams[currTrial.trueHyper])}.</h4>`
	: `<h4>You land on this island, and you don't see any turtles yet</h4>`}
	<h5>Teacher A wants to show you 
	${ex_to_text(teacherSets[currTrial.teacherPairing]['A'])}, 
	while Teacher B wants to show you 
	${ex_to_text(teacherSets[currTrial.teacherPairing]['B'])}.</h5>`
};

function teacherChoice (stage) {
	return `
	<div>
		<p>
		Which teacher would you ${stage == 'first' ? `` : `now`} like to learn from?
		</p>
	</div>
	<fieldset style="border:0; padding-top:0;" class="center">
		<input type="radio" name="teacher" value="A" id="A">
		<label for="A">A</label>
		<input type="radio" name="teacher" value="B" id="B">
		<label for="B">B</label>
    </fieldset>`
};

function studentGuess () {
	return `<div style="text-align:center;">
	<p>Out of <b>100</b> turtles on the island, how many orange and purple 
	turtles do you expect to see?</p>
	<p><input name="heads" type="number" min="0" max="${params.maxExamples}" value="0"
	id="1" required/><b style="color:Orange;"> orange</b> turtles </p>
	<p><input name="tails" type="number" min="0" max="${params.maxExamples}" value="0"
	id="2" required/><b style="color:Purple;"> purple</b> turtles </p>
	</div>`
};

function makeIntermediateBlock (stage) 
{
	return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<p>${stage == 'final' ? `Time to move on to the next student! ` : ``}
						Press any key to continue.</p>`,
        trial_duration: stage == 'int' ? 10000 : 20000
    }
}

function fixationBlock (i) 
{
	return {
		timeline: [
			{
				type: jsPsychHtmlKeyboardResponse,
				stimulus: '<div style="font-size:60px;">Next student</div>',
				choices: "NO_KEYS",
				trial_duration: function () {
					return jsPsych.randomization.
							sampleWithoutReplacement([2000, 2250, 2500, 3000], 1)[0];
				}
			}
		],

		// Skip if we are on last trial
		conditional_function: function () {
			return i < design.length - 1
		}
	}
};

function makeLoop(stage, timelineArr)
{
	return {
		timeline: timelineArr,
		loop_function: function (data) {
			if (stage == 'comprehension')
			{
				return !data.select("pass").values[0];
			}
			else 
			{
				var teacher = data.values()[0].teacher;
				if (stage == 'first') 
				{
					var totalFlips = parseInt(data.values()[0].heads) + 
									parseInt(data.values()[0].tails);
					return totalFlips !== params.maxExamples || (teacher !== 'A' && teacher !== 'B')
				}
				else
				{
					return teacher !== 'A' && teacher !== 'B'
				}
			}
		}
	}
};

function makeReview (i, currTrial)
{
	return `
        <h3>Island ${i + 1}'s actual turtle composition</h3>
        <h3 style="color:tomato; padding-top: 1em">Review</h3>
        <ul>
        <li>
        	<p>
            Upon arriving on the island, you
			${currTrial.condition === 'nonSeqNoPrior' ? ` didn't see any turtles`
									: ` saw ` + ex_to_text(hyperParams[currTrial.trueHyper])}
        	</p>
        </li>
        <li>
            <p>
            Teacher A wanted to show you ${ex_to_text(teacherSets[currTrial.teacherPairing]['A'])}
            </p>
        </li>
        <li>
            <p>
            Teacher B wanted to show you ${ex_to_text(teacherSets[currTrial.teacherPairing]['B'])}
            </p>
        </li>
        </ul><br>`
}

function makeSecondExamples (currTrial)
{
	return `
	<ul>
	<li>
		<p class="examplesA">
		Teacher A wants to show you an additional 
		${ex_to_text(teacherSets[currTrial.teacherPairing]['A'])}
		</p>
	</li>
	<li>
		<p class="examplesB">
		Teacher B wants to show you an additional 
		${ex_to_text(teacherSets[currTrial.teacherPairing]['B'])}
		</p>
	</li>
	</ul><br>
	`
}

function makeFinalDecision (i, currTrial, firstResponse = null)
{
	return makeReview(i, currTrial) + 
		(currTrial.condition == 'seqFeedback' ?
			`<p>After seeing your guess of <b style="color:Orange;">${firstResponse.heads}</b>
			orange turtle${firstResponse.heads === 1 ? '' : 's'} to 
			<b style="color:Purple;">${firstResponse.tails}</b>
			purple turtle${firstResponse.tails === 1 ? '' : 's'},
			the teachers gave you the following sets of examples:<br>` 
			+ makeSecondExamples (currTrial)
		: ``) 
		+ `<p>On this island, out of 100 turtles you can actually expect to see
		${ex_to_text({a: currTrial.coinWeight * 100, b: 100 - currTrial.coinWeight * 100})}. <br>`
}