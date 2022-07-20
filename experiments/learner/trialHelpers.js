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
}

// allows numbers to sum to 100 when student makes their guess
function createResponsiveInputs () 
{
		function changeInput2(){
			var val_1 = document.getElementById('1').value;
			var val_2 = 100 - parseInt(val_1);
			document.getElementById('2').value = val_2;
		};
		var input_1 = document.getElementById('1');
		input_1.onchange = function(){
			changeInput2();
		};
		input_1.onkeyup = function(){
			changeInput2();
		};
			
		var input_2 = document.getElementById('2');
		function changeInput1(){
			var val_2 = document.getElementById('2').value;
			var val_1 = 100 - parseInt(val_2);
			document.getElementById('1').value = val_1;
		}
		input_2.onchange = function(){
			changeInput1();
		}
		input_2.onkeyup = function(){
			changeInput1();  
		};
}

// allows numbers to sum to 100 when student makes their guess
function createResponsiveInputs () {
	function changeInput2(){
		var val_1 = document.getElementById('1').value;
		var val_2 = 100 - parseInt(val_1);
		document.getElementById('2').value = val_2;
	};
	var input_1 = document.getElementById('1');
	input_1.onchange = function(){
		changeInput2();
	};
	input_1.onkeyup = function(){
		changeInput2();
	};
		
	var input_2 = document.getElementById('2');
	function changeInput1(){
		var val_2 = document.getElementById('2').value;
		var val_1 = 100 - parseInt(val_2);
		document.getElementById('1').value = val_1;
	}
	input_2.onchange = function(){
		changeInput1();
	}
	input_2.onkeyup = function(){
		changeInput1();  
	};
};

// adds text based on the new teacher's examples
function fetchSpeakerExamples (theta, firstExample, guess, teacher) 
{
    $.get('./precalc.json', function(data) {
        $(".examples" + teacher).html(`Teacher ` + teacher + ` wants to show you an additional 
			${ex_to_text(data.filter(x => x.theta == theta && 
						x.firstExample.a == firstExample.a && 
						x.guess.a == guess.a)[0].secondExample)}`);
    })
};

// handles timeouts dependent on whether firstExample or finalDecision
function handleTimeouts (stage, data) 
{
	jsPsych.pluginAPI.clearAllTimeouts();
	var nHeads, nTails, teacher;
    if (data.response != null) { // if no timeout
        if (stage == 'first') 
        {
            nHeads = parseInt(data.response.heads);
            nTails = parseInt(data.response.tails);
        }
        teacher = data.response.teacher;
    } else {
        
		if (stage == 'first')
        {
            nHeads = 0;
            nTails = 0;
        }
        teacher = null;
    }
	return {nHeads: nHeads, nTails: nTails, teacher: teacher}
};

function makeInitialData (stage, currTrial)
{
	return {
		type: 'response',
		condition: currTrial.condition,
		trueTheta: currTrial.coinWeight,
		teachers: currTrial.teacherPairing,
		studentTrueClassroom: currTrial.condition == 'nonSeqPrior' ? currTrial.trueHyper : null,
		responseSet: stage
	}
}

// saves data for each trial
function saveData (stage, data, currTrial, i)
{
	info = handleTimeouts(stage, data);

	var studentTrueHypers = currTrial.condition === 'nonSeqNoPrior' ? 
							{ a: 0, b: 0 } : hyperParams[currTrial.trueHyper];

	data.studentIndex = i;
	data.studentTrueHypers = studentTrueHypers;
	data.teacher = info.teacher;

	if (stage == 'first')
	{
		data.heads = info.nHeads;
		data.tails = info.nTails;
		data.totalExamples = info.nHeads + info.nTails;
		data.studentGuess = {a: data.heads, b: data.tails};
		currTrial.studentGuess = data.studentGuess;
	}
	else
	{
		var correctTeacher = calc_teacher(studentTrueHypers, data.trueTheta, 
											teacherSets[data.teachers]);
		data.bonus = data.teacher === correctTeacher ? params.perTrialBonus : 0;
		data.bonusSoFar = Number(jsPsych.data.get().select('bonus').sum().toFixed(2));
	}

	return data, currTrial;
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
		createResponsiveInputs();
	}
	else if (currTrial.condition == 'seqFeedback')
	{
		fetchSpeakerExamples(currTrial.coinWeight, 
							teacherSets[currTrial.teacherPairing][currTrial.adaptiveTeacher], 
                            currTrial.studentGuess, currTrial.adaptiveTeacher);
	};
}