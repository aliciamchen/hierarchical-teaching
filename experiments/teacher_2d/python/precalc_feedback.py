import json

true_concept_options = {
    "stemThresholds": [2.5, 4.5, 6.5],
    "capThresholds": [2.5, 4.5, 6.5],
    "stemDirections": ["less", "greater"],
    "capDirections": ["less", "greater"],
}

priors = ["stem", "cap"]


def find_possible_responses(trueH):
    vals = [i for i in range(1, 9)]

    if trueH["stemDirection"] == "less":
        stems = filter(lambda x: x < trueH["stemThreshold"], vals)
    else:
        stems = filter(lambda x: x > trueH["stemThreshold"], vals)

    if trueH["capDirection"] == "less":
        caps = filter(lambda x: x < trueH["capThreshold"], vals)
    else:
        caps = filter(lambda x: x > trueH["capThreshold"], vals)

    return {"possibleStems": list(stems), "possibleCaps": list(caps)}


def generate_learner_guess(trueH, prior):
    """For the unknown dimension, threshold is 1 away and direction is opposite"""
    if prior == "stem":
        guess = {
            "stemThreshold": trueH["stemThreshold"],
            "stemDirection": trueH["stemDirection"],
            "capThreshold": trueH["capThreshold"] + 1
            if trueH["capDirection"] == "greater"
            else trueH["capThreshold"] - 1,
            "capDirection": "less" if trueH["capDirection"] == "greater" else "greater"
        }
    elif prior == "cap":
        guess = {
            "capThreshold": trueH["capThreshold"],
            "capDirection": trueH["capDirection"],
            "stemThreshold": trueH["stemThreshold"] + 1
            if trueH["stemDirection"] == "greater"
            else trueH["stemThreshold"] - 1,
            "stemDirection": "less"
            if trueH["stemDirection"] == "greater"
            else "greater",
        }

    return guess


poss = []

for stem_thresh in true_concept_options["stemThresholds"]:
    for cap_thresh in true_concept_options["capThresholds"]:
        for stem_dir in true_concept_options["stemDirections"]:
            for cap_dir in true_concept_options["capDirections"]:

                response = find_possible_responses(
                    {
                        "stemThreshold": stem_thresh,
                        "capThreshold": cap_thresh,
                        "stemDirection": stem_dir,
                        "capDirection": cap_dir,
                    }
                )


                for prior in priors:
                    for stem_response in response["possibleStems"]:
                        for cap_response in response["possibleCaps"]:
                            guess = generate_learner_guess(
                                {
                                    "stemThreshold": stem_thresh,
                                    "capThreshold": cap_thresh,
                                    "stemDirection": stem_dir,
                                    "capDirection": cap_dir,
                                },
                                prior,
                            )
                            poss.append(
                                {
                                    "trueH": {
                                        "stemThreshold": stem_thresh,
                                        "capThreshold": cap_thresh,
                                        "stemDirection": stem_dir,
                                        "capDirection": cap_dir,
                                    },
                                    "prior": prior,
                                    "response": {
                                        "stemResponse": stem_response,
                                        "capResponse": cap_response,
                                    },
                                    "learnerGuess": guess,
                                }
                            )


with open("../precalc_2d_new.json", "w") as f:
    json.dump(poss, f)
