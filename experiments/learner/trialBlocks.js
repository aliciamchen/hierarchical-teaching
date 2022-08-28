function makeFirstExamples (currTrial) {
	return `
	<div class="firstExamples">
		<h2 style="color:Blue; padding-bottom:0.5em;">Lesson 1</h2>
		<em style="color:#980000;">
			Reminder: you initially saw
			${ex_to_text(hyperParams[currTrial.trueHyper])}.
		</em><br>
		<p class="examples"></p><br>
	</div>`
};

// makes html slider for student to decide full vs partial knowledge (output 0 to 100)
function makeKnowledgeSlider () {
	return `
	<div class="jspysch-html-slider-response-container"
	style="position:relative; margin: 0 auto 3em auto; width=auto">
		<p>Do you think the teacher knows the turtles you have seen?</p>
		<div class="knowledgeSliderContainer" id="sliderContainer">
			<input type="range" class="jspsych-slider" value="50" min="0" max="100" +
			id="jspsych-html-slider-response-response2" name="teacherKnowledge"></input>
			<div class="knowledgeSliderLabels">
				<div style="border: 1px solid transparent; display: inline-block;
				position: absolute; left:calc(-13.75% + 7.5px); text-align: center; width: 50%;">
					<span style="text-align: center; font-size: 90%;">Doesn't know</span>
				</div>
				<div style="border: 1px solid transparent; display: inline-block;
				position: absolute;	left:calc(63.75% - 7.5px); text-align: center; width: 50%;">
					<span style="text-align: center; font-size: 90%;">Knows</span>
				</div>
			</div>
		</div>
	</div>

	<input class="examplesA" style="display:none" type="number" name="examplesA">
	<input class="examplesB" style="display:none" type="number" name="examplesB">
	`
};

// makes slider for student to decide which island they are on (note: some parts hardcoded)
function makeIslandSlider (stage) {
	return `
	<div class="jspysch-html-slider-response-container"
	style="position:relative; margin: 1em auto 3em auto; width=auto">
		<p>Out of every 10 turtles on the island, how many orange and purple
		turtles do you ${stage == 'final' ? `now ` : ``}expect to see?</p>
		<div class="islandSliderContainer" id="sliderContainer">
			<input type="range" class="jspsych-slider" value="50" min="0" max="100" +
			id="jspsych-html-slider-response-response2" name="studentGuess"></input>
			<div class="islandSliderLabels">
				<div style="border: 1px solid transparent; display: inline-block;
				position: absolute; left:calc(-18.75% + 7.5px); text-align: center; width: 50%;">
					<span style="text-align: center; font-size: 90%;">
						<b style="color:Orange">3</b><b> : </b><b style="color:Purple">7</b>
					</span>
				</div>
				<div style="border: 1px solid transparent; display: inline-block;
				position: absolute; left:calc(25%); text-align: center; width: 50%;">
					<span style="text-align: center; font-size: 90%;">Unsure</span>
				</div>
				<div style="border: 1px solid transparent; display: inline-block;
				position: absolute; left:calc(68.75% - 7.5px); text-align: center; width: 50%;">
					<span style="text-align: center; font-size: 90%;">
						<b style="color:Orange">7</b><b> : </b><b style="color:Purple">3</b>
					</span>
				</div>
			</div>
		</div>
	</div>

	<input class="secondExA" style="display:none" type="number" name="secondExA">
	<input class="secondExB" style="display:none" type="number" name="secondExB">
	`
};

// only to be used for attention checks
function attentionExamples(currTrial)
{
	return `
	<h4 class="heading" style="color:Blue;">Welcome to a new island!</h4>
	<h4><b>This page is an attention check and does not count toward your bonus.</b></h4>
	<p style="padding: 0.5em 0em 0.5em;">Please select that your teacher
		<b style="color:Orange">
			${currTrial.attentionParams.knowledge == 'full' ? `knows` : `doesn't know`}
		</b>
	what turtles you have seen,
	and select that you
		<b style="color:Purple">
			would ${currTrial.attentionParams.feedback == 'no' ? `not ` : ``}
		</b>
	like to send the teacher a guess.
	</p>
	<p style="padding-bottom: 0.5em;">
		You must pass all attention checks to have your HIT accepted.
	</p>`
}

// yes/no html buttons for student to decide whether or not to provide feedback
function feedbackChoice () {
	return `
	<div>
		<p>Would you like to send the teacher a guess for $${params.feedbackCost.toFixed(2)}?</p>
	</div>
	<fieldset style="border:0; padding-top:0;" class="center" id="feedbackChoice">
		<input type="radio" name="feedbackChoice" value="yes" id="yes">
		<label for="yes">Yes</label>
		<input type="radio" name="feedbackChoice" value="no" id="no">
		<label for="no">No</label>
    </fieldset>
	<div id="islandGuess"></div>`
};

// makes entire block for first examples, see trialHelpers.js for functions called
function makeFirstExampleBlock (i, currTrial)
{
	return {
        type: jsPsychSurveyHtmlForm,
        preamble: makeFirstExamples(currTrial),
        html: makeKnowledgeSlider() + feedbackChoice(),
        button_label: 'Submit information',
        data: makeInitialData ('first', currTrial),
        on_load: function () { loadFunction('first', currTrial) },
        on_finish: function (data) { 
			newData = saveData('first', data, currTrial, i);
			data = newData.data; 
			currTrial = newData.currTrial;
		}
    }
};

function makeIntermediateBlock (stage)
{
	return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<p>${stage == 'final' ? `Time to move on to the next student! ` : ``}
						Press any key to continue.</p>`,
        trial_duration: stage == 'int' ? 10000 : 20000
    }
};

function fixationBlock (i)
{
	return {
		timeline:
			[{
				type: jsPsychHtmlKeyboardResponse,
				stimulus: '<div style="font-size:60px;">Next island</div>',
				choices: "NO_KEYS",
				trial_duration: function () {
					return jsPsych.randomization.
							sampleWithoutReplacement([2000, 2250, 2500, 3000], 1)[0];
				}
			}],

		// Skip if we are on last trial
		conditional_function: function () {
			return i < design.length - 1
		}
	}
};

// makes various types of loops to ensure student interacts with page correctly
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
				if (stage == 'first')
				{
					var feedbackChoice = data.values()[0].feedbackChoice;
					return feedbackChoice !== 'yes' && feedbackChoice !== 'no';
				}
			}
		}
	}
};

function makeSecondExamples (currTrial) {
	return `
	<div class="secondExamplesContainer">
		<h2 style="color:Blue; padding-bottom:0.5em;" class="heading">Lesson 2</h2>
		<em style="color:#980000;">
			Reminder: you initially saw
			${ex_to_text(hyperParams[currTrial.trueHyper])}, and
		</em><p></p>
		<em style="color:#980000;" class="examples"></em><br>
		<p class="secondExamples" style="padding-top:0.5em;"></p>
	</div>`
};

function makeFinalDecisionBlock (i, currTrial)
{
	return {
        type: jsPsychSurveyHtmlForm,
        preamble: makeSecondExamples(currTrial),
        html: makeIslandSlider('final'),
        button_label: 'Submit information',
        data: makeInitialData('final', currTrial),
        on_load: function () { loadFunction('final', currTrial) },
        on_finish: function (data) { 
			newData = saveData('final', data, currTrial, i);
			data = newData.data; 
			currTrial = newData.currTrial;
		}
    }
};

function makeAttentionBlock (i, currTrial)
{
	return {
        type: jsPsychSurveyHtmlForm,
        preamble: attentionExamples(currTrial),
        html: makeKnowledgeSlider() + feedbackChoice(),
        button_label: 'Send guess to teachers',
        data: makeInitialData ('attention', currTrial),
        on_load: function () { loadFunction('attention', currTrial) },
        on_finish: function (data) { 
			newData = saveData('attention', data, currTrial, i);
			data = newData.data; 
			currTrial = newData.currTrial;
		}
    }
};

// first block that student sees (island turtle composition)
function makePriorBlock (i, currTrial)
{
	return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus:
		`<h4 class="heading" style="color:Blue;">Welcome to Island ${i + 1}!</h4>
		<p>
			Upon arriving, you wander around one part of the island, where you saw
			${ex_to_text(hyperParams[currTrial.trueHyper])}.
		</p>
		<img src='img/${hyperParams[currTrial.trueHyper].a}orange
						${hyperParams[currTrial.trueHyper].b}purple
		.png' width="600"></img>
		<p>Press any key to continue.</p>`
    }
};