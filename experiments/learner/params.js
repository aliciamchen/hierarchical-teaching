const params = {
    nTrials: 10,
    maxExamples: 100,
    completionMinutes: 30,
    basePay: 5,
    maxBonus: 12,
    perTrialBonus: 0.25,
    perTrialBonusThreshold: 0.08,
    exampleCost: 0.01
};

const teacherSets = {
    1: {'A' : { a: 3, b: 7 },
        'B': { a: 9, b: 1 }},
    2: {'A' : { a: 7, b: 3 },
        'B': { a: 3, b: 7 }},
};

const hyperParams = {
    'A': { a: 1, b: 9 },
    'B': { a: 9, b: 1 }
};

const conditions = [['nonSeqPrior'], ['nonSeqNoPrior'], ['seqFeedback']];
const teacherPairings = [1,2];
const hyperPairings = [['A', 'B']];
const coinWeights = [0.3, 0.7];

const trueHypers = hyperPairings.flat();

const factorsNonSeqPrior = {
    condition: conditions[0],
    teacherPairing: teacherPairings,
    coinWeight: coinWeights,
    trueHyper: trueHypers
};

const factorsNonSeqNoPrior = {
    condition: conditions[1],
    teacherPairing: teacherPairings,
    coinWeight: coinWeights
};

const factorsSeq = {
    condition: conditions[2],
    teacherPairing: teacherPairings,
    coinWeight: coinWeights,
    trueHyper: trueHypers,
    hyperPairing: hyperPairings
};