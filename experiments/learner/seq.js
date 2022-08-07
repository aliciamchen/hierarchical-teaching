function sequentialTrial (i) {
	var currTrial = design[i];

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