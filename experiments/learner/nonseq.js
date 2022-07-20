function nonSequentialTrial (i)
{
	var currTrial = design[i];

    var firstExample = {
        type: jsPsychSurveyHtmlForm,
        preamble: firstExamples(i, currTrial),
        html: teacherChoice('first') + studentGuess(),
        button_label: 'Send guess to teachers',
        data: makeInitialData ('first', currTrial),
        on_load: function () { loadFunction('first', currTrial) },
        on_finish: function (data) { data, currTrial = saveData('first', data, currTrial, i) }
    };

	var firstExampleLoop = makeLoop('first', [firstExample]);

    var intermediate = makeIntermediateBlock('int');

    var finalDecision = {
        type: jsPsychSurveyHtmlForm,
        preamble: makeFinalDecision(i, currTrial),
        html: teacherChoice('final'),
        button_label: 'Submit your teacher choice',
        data: makeInitialData('final', currTrial),
        on_load: function () { loadFunction('final', currTrial) },
        on_finish: function (data) { data, currTrial = saveData('final', data, currTrial, i) }
    };

    var finalDecisionLoop = makeLoop('final', [finalDecision]);

    var finalFeedback = makeIntermediateBlock('final');

    var fixation = fixationBlock(i);

    timeline.push([firstExampleLoop, intermediate, finalDecisionLoop, finalFeedback, fixation])

    // Add attention check
    if (attention_locations.includes(i)) {
        timeline.push(jsPsych.randomization.sampleWithoutReplacement(attention_trials, 1)[0]);
        timeline.push([fixation])
    }
};