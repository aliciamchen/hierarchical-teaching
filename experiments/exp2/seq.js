// see trialBlocks.js and trialHelpers.js for all methods called below
function sequentialTrial (i) {
	var currTrial = design[i];
    currTrial.coinWeight = jsPsych.randomization.sampleWithoutReplacement(coinWeights, 1)[0]
    currTrial.condition = jsPsych.randomization.sampleWithoutReplacement(conditions, 1)[0]


    var priorLoop = makeLoop('prior', [makePriorBlock(i, currTrial)]);

    var firstExampleLoop = makeLoop('first', [makeFirstExampleBlock(i, currTrial)]);

    var intermediate = makeIntermediateBlock('int');

    var finalDecisionLoop = makeLoop('final', [makeFinalDecisionBlock(i, currTrial)]);

    var finalFeedback = makeIntermediateBlock('final');

    var fixation = fixationBlock(i);

    timeline.push(priorLoop, firstExampleLoop, intermediate,
                finalDecisionLoop, finalFeedback, fixation);
    pushAttentionChecks(i);
}