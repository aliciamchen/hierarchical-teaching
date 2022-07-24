function nonSequentialTrial (i)
{
	var currTrial = design[i];

	var firstExampleLoop = makeLoop('first', [makeFirstExampleBlock(i, currTrial)]);

    var intermediate = makeIntermediateBlock('int');

    var finalDecisionLoop = makeLoop('final', [makeFinalDecisionBlock(i, currTrial)]);

    var finalFeedback = makeIntermediateBlock('final');

    var fixation = fixationBlock(i);

    timeline.push([firstExampleLoop, intermediate, finalDecisionLoop, finalFeedback, fixation])

    pushAttentionChecks(i, fixation);
};