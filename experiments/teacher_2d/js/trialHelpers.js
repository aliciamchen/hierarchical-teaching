// TODO: stim function that takes in trial type
function checkResponseInConcept(data, trial) {
    var stemResponse = data.values()[0].response1
    var capResponse = data.values()[0].response2

    var stemOK = trial.stemDirection === 'less' ? stemResponse < trial.stemThreshold : stemResponse > trial.stemThreshold
    var capOK = trial.capDirection === 'less' ? capResponse < trial.capThreshold : capResponse > trial.capThreshold
    return !(stemOK && capOK)
}

function makeExamplePreamble(trial) {
    if (trial.scenario === 'nonSeqFull') {
        return (trial.prior === 'stem' ?
            sprintf($('#preambleFullStem').html(), trial.stemDirection, trial.stemThreshold, trial.capDirection, trial.capThreshold, trial.studentIdx + 1)
            :
            sprintf($('#preambleFullCap').html(), trial.stemDirection, trial.stemThreshold, trial.capDirection, trial.capThreshold, trial.studentIdx + 1)
        )
    } else {
        return sprintf($('#preamblePartial').html(), trial.stemDirection, trial.stemThreshold, trial.capDirection, trial.capThreshold, trial.studentIdx + 1)
    }
}

// again, needed for dynamic feedback within stim function
// myHTML should be `id="preambles"`
function makeExamplePreambleFromHTML(trial, myHTML) {
    $html = $(myHTML)
    if (trial.scenario === 'nonSeqFull') {
        return (trial.prior === 'stem' ?
            sprintf($html.filter('#preambleFullStem').html(), trial.stemDirection, trial.stemThreshold, trial.capDirection, trial.capThreshold, trial.studentIdx + 1)
            :
            sprintf($html.filter('#preambleFullCap').html(), trial.stemDirection, trial.stemThreshold, trial.capDirection, trial.capThreshold, trial.studentIdx + 1)
        )
    } else {
        return sprintf($html.filter('#preamblePartial').html(), trial.stemDirection, trial.stemThreshold, trial.capDirection, trial.capThreshold, trial.studentIdx + 1)
    }
}

function makeLabels(threshold, direction, nLabels) {
    var labels = []
    for (let label = 1; label <= nLabels; label++) {
        if (label < threshold) {
            if (direction === 'less') {
                labels.push(`<b style="color: #648FFF">${label}</b>`)
            } else {
                labels.push(`<b style="color:#f77140">${label}</b>`)
            }
        } else if (label > threshold) {
            if (direction === 'less') {
                labels.push(`<b style="color:#f77140">${label}</b>`)
            } else {
                labels.push(`<b style="color:#648FFF">${label}</b>`)
            }
        } else {
            labels.push(label)
        }
    }
    return labels;
}


function getJSON(path) {
    return fetch(path).then(response => response.json());
}

function fetchLearnerFeedback(currTrial, stemResponse, capResponse) {

    var arr = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': "./precalc_2d.json",
        'dataType': "json",
        'success': function (data) {
            thisTrial = data.filter(
                x => (
                    x.trueH.stemThreshold == currTrial.stemThreshold
                    && x.trueH.stemDirection == currTrial.stemDirection
                    && x.trueH.capThreshold == currTrial.capThreshold
                    && x.trueH.capDirection == currTrial.capDirection
                    && x.prior == currTrial.prior
                    && x.response.stemResponse == stemResponse
                    && x.response.capResponse == capResponse
                )

            )

            learnerFeedback = thisTrial[0].learnerGuess
            arr = learnerFeedback;
        }
    });

    console.log(arr)
    return arr;
};