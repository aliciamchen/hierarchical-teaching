const params = {
    nTrials: 12,
    maxExamples: 100,
    completionMinutes: 20,
    basePay: 3,
    maxBonus: 6,
    perTrialBonus: 0.50,
    feedbackCost: 0.10
};

const hyperParams = {
    'A': { a: 1, b: 9 },
    'B': { a: 9, b: 1 }
};

const conditions = ['full', 'partial'];
const hyperPairings = [['A', 'B']];
const coinWeights = [0.3, 0.7];

const trueHypers = hyperPairings.flat();
const firstExamples = [
    {a: 0, b: 5},
    {a: 1, b: 4},
    {a: 2, b: 3},
    {a: 3, b: 2},
    {a: 4, b: 1},
    {a: 5, b: 0},
];

const factors = {
    condition: ["partial"],
    trueHyper: trueHypers,
    hyperPairing: hyperPairings,
    firstExample: firstExamples
};