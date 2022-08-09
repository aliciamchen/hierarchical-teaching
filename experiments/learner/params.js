const params = {
    nTrials: 10,
    maxExamples: 100,
    completionMinutes: 20,
    basePay: 3,
    maxBonus: 7,
    perTrialBonus: 0.25,
    perTrialBonusThreshold: 0.08,
    feedbackCost: 0.10
};

const hyperParams = {
    'A': { a: 1, b: 9 },
    'B': { a: 9, b: 1 }
};

const conditions = [['full'], ['partial']];
const hyperPairings = [['A', 'B']];
const coinWeights = [0.3, 0.7];

const trueHypers = hyperPairings.flat();

const factors = {
    condition: conditions,
    coinWeight: coinWeights,
    trueHyper: trueHypers,
    hyperPairing: hyperPairings
};