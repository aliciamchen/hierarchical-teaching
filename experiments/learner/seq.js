function sequentialTrial (i) {
	var currTrial = design[i];
    currTrial.adaptiveTeacher = adaptiveA.includes(i) ? 'A' : 'B';
    currTrial.nonAdaptiveTeacher = adaptiveA.includes(i) ? 'B' : 'A';

    var firstExampleLoop = makeLoop('first', [makeFirstExampleBlock(i + len, currTrial)]);

    var intermediate = makeIntermediateBlock('int');

    var finalDecisionLoop = makeLoop('final', [makeFinalDecisionBlock(i + len, currTrial)]);

    var finalFeedback = makeIntermediateBlock('final');

    var fixation = fixationBlock(i);

    timeline.push(firstExampleLoop, intermediate, finalDecisionLoop, finalFeedback, fixation)
    pushAttentionChecks(i);
}