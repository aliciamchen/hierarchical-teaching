// creates "n orange turtle(s) and n purple turtle(s) text"
function ex_to_text(examples)
{
    return ` <b style="color:Orange;">${examples.a}</b>
				orange turtle${examples.a === 1 ? '' : 's'} and 
				<b style="color:Purple;">${examples.b}</b>
				purple turtle${examples.b === 1 ? '' : 's'}`
};

// calculates which teacher is expected here
function calc_teacher (hypers, trueTheta, teachers) {
	var aTheta = (teachers['A'].a + hypers.a) / 
				(teachers['A'].a + hypers.a + teachers['A'].b + hypers.b)
	var bTheta = (teachers['B'].a + hypers.a) / 
				(teachers['B'].a + hypers.a + teachers['B'].b + hypers.b)
	return Math.abs(aTheta - trueTheta) < Math.abs(bTheta - trueTheta) ? 'A' : 'B'
};

// allows numbers to sum to 100 when student makes their guess
function responsiveIslandGuess () {
	function islandGuess(state)
	{
		$("#jspsych-survey-html-form-next").attr("disabled", false);
		var islandGuess = document.getElementById('islandGuess');
		if (state == 'appear')
		{
			islandGuess.innerHTML = makeIslandSlider('first');
		}
		else 
		{
			islandGuess.innerHTML = ``;
		}
	};
	var yes_input = document.getElementById('yes');
	yes_input.onclick = function(){
		islandGuess("appear");
	};
	var no_input = document.getElementById('no');
	no_input.onclick = function(){
		islandGuess("disappear");
	};
};


// adds text based on the new teacher's examples
function fetchFirstExamples (currTrial, stage = 'first') 
{
    $.get('./json/firstExamples.json', function(data) {
		if (currTrial.firstExample) {
			var firstExamples = currTrial.firstExample;
		}
		else {
			var firstExamples = data.filter(x => x.theta == currTrial.coinWeight && 
											x.condition == currTrial.condition &&
											x.hypers.a == hyperParams[currTrial.trueHyper].a
											)[0].examples;
		}
        $(".examples")
			.html(`${stage == 'first' ? `Your teacher shows` : `your teacher showed`}
				 you ${ex_to_text(firstExamples)}.`);
		$(".examplesA").val(firstExamples.a);
		$(".examplesB").val(firstExamples.b);
    })
};

// adds text based on the new teacher's examples
function fetchSecondExamples (currTrial) 
{
	$.get('./json/precalc.json', function(data) {
		fetchFirstExamples(currTrial, 'final');
		var secondExamples = data.filter(x => x.theta == currTrial.coinWeight 
											&& x.firstExample.a == currTrial.firstExamples.a 
											// needs fixing, not accurate second examples
											&& x.guess.a == currTrial.coinWeight * 100
											)[0].secondExample;
        $(".secondExamples")
			.html(`<p>Your teacher shows you an additional ${ex_to_text(secondExamples)}</p>`);
		$(".secondExA").val(secondExamples.a);
		$(".secondExB").val(secondExamples.b);
    })
};

// handles timeouts dependent on whether firstExample or finalDecision
function handleTimeouts (stage, data) 
{
	jsPsych.pluginAPI.clearAllTimeouts();
	var teacherKnowledge, feedbackChoice, studentGuess;

	// checks there has been no timeout
    if (data.response != null) 
	{
        if (stage !== 'final') 
        {
            teacherKnowledge = data.response.teacherKnowledge;
			feedbackChoice = data.response.feedbackChoice;
			studentGuess = feedbackChoice == 'yes' ? data.response.studentGuess : null;
			return {teacherKnowledge: teacherKnowledge, 
				feedbackChoice: feedbackChoice, 
				studentGuess: studentGuess}
        }
        else
		{
			studentGuess = data.response.studentGuess;
			return {studentGuess: studentGuess}
		}
    } 
	else 
	{
			teacherKnowledge = feedbackChoice = studentGuess = null;
			return {teacherKnowledge: teacherKnowledge, 
				feedbackChoice: feedbackChoice, 
				studentGuess: studentGuess}
    }
};

function makeInitialData (stage, currTrial)
{
	return {
		type: stage == 'attention' ? 'attention' : 'response',
		condition: currTrial.condition,
		trueTheta: currTrial.coinWeight,
		studentTrueClassroom: currTrial.trueHyper,
		responseSet: stage
	}
};

// saves data for each trial
function saveData (stage, data, currTrial, i)
{
	info = handleTimeouts(stage, data);

	data.studentIndex = i;
	data.studentTrueHypers = hyperParams[currTrial.trueHyper];

	if (stage !== 'final')
	{
		data.teacherKnowledge = info.teacherKnowledge;
		data.feedbackChoice = currTrial.feedbackChoice = info.feedbackChoice;

		if (stage == 'first')
		{
			data.firstGuess = currTrial.studentGuess = info.studentGuess;
			data.firstExamples = currTrial.firstExamples = 
					{a: parseInt(data.response.examplesA), b: parseInt(data.response.examplesB)};
		}
		else
		{
			data.attentionParams = currTrial.attentionParams;
			data.attentionPassed = (currTrial.attentionParams.knowledge == 'full' 
									? data.teacherKnowledge > 50
									: data.teacherKnowledge < 50) &&
									currTrial.attentionParams.feedback == data.feedbackChoice;
		}
	}
	else
	{
		data.finalGuess = info.studentGuess;
		data.secondExamples = currTrial.secondExamples = 
				{a: parseInt(data.response.secondExA), b: parseInt(data.response.secondExB)};
		data.bonus = data.trueTheta == 0.7 ? 
						data.finalGuess > 50 ? params.perTrialBonus : 0 
						: data.finalGuess < 50 ? params.perTrialBonus : 0;
		data.bonus -= currTrial.feedbackChoice == 'yes' ? params.feedbackCost : 0;
		data.bonusSoFar = Number(jsPsych.data.get().select('bonus').sum().toFixed(2));
	}

	return {data: data, currTrial: currTrial};
};

function loadFunction(stage, currTrial)
{
	var start_time = performance.now();
	end_test_timer = jsPsych.pluginAPI.setTimeout(function () {
		var end_time = performance.now();
		var elapsed_time = end_time - start_time;
		jsPsych.finishTrial({ status: 'timeout' });
	}, 90000);
	if (stage == 'first') 
	{
		fetchFirstExamples(currTrial);
		responsiveIslandGuess();
		$("#jspsych-survey-html-form-next").attr("disabled", true);
	}
	else if (stage == 'final')
	{
		fetchSecondExamples(currTrial);
	};
};

function pushAttentionChecks (i) 
{
	if (attention_locations.includes(i)) {
        timeline.push(jsPsych.randomization.sampleWithoutReplacement(attention_trials, 1)[0]);
    }
};

function attentionTrial (i) 
{
	// randomly sample from design params for attention check
    var currTrial = jsPsych.randomization.sampleWithoutReplacement(design, 1)[0];
	currTrial.attentionParams = 
						jsPsych.randomization.sampleWithoutReplacement(attention_params, 1)[0];
	attention_trials.push([makeAttentionBlock(i, currTrial), 
							makeIntermediateBlock('final'), fixationBlock(i)]);
};