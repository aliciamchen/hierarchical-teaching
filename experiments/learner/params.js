const params = {
    nTrials: 10,
    maxExamples: 100,
    completionMinutes: 20,
    basePay: 3,
    maxBonus: 5,
    perTrialBonus: 0.50,
    feedbackCost: 0.20
};

const hyperParams = {
    'A': { a: 1, b: 9 },
    'B': { a: 9, b: 1 }
};

const conditions = ['full', 'partial'];
const hyperPairings = [['A', 'B']];
const coinWeights = [0.3, 0.7];

const trueHypers = hyperPairings.flat();

const factors = {
    condition: conditions,
    coinWeight: coinWeights,
    trueHyper: trueHypers,
    hyperPairing: hyperPairings
};

const extremeFactors = [
    {condition: 'partial',
    coinWeight: 0.7,
    trueHyper: 'B',
    hyperPairing: ['A', 'B'],
    firstExamples: {a: 10, b: 0}},
    {condition: 'partial',
    coinWeight: 0.3,
    trueHyper: 'A',
    hyperPairing: ['A', 'B'],
    firstExamples: {a: 0, b: 10}}
];