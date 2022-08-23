// TODO: stim function that takes in trial type
function checkResponseInConcept(data, trial) {
  var stemResponse = data.values()[0].response1;
  var capResponse = data.values()[0].response2;

  var stemOK =
    trial.stemDirection === "less"
      ? stemResponse < trial.stemThreshold
      : stemResponse > trial.stemThreshold;
  var capOK =
    trial.capDirection === "less"
      ? capResponse < trial.capThreshold
      : capResponse > trial.capThreshold;
  return !(stemOK && capOK);
}

function makeExamplePreamble(trial) {
  var gridhtml = $("#mushroomGrid").html();
  if (trial.scenario === "nonSeqFull") {
    return trial.prior === "stem"
      ? sprintf(
          $("#preambleFullStem").html(),
          trial.stemDirection,
          trial.stemThreshold,
          trial.capDirection,
          trial.capThreshold,
          makeGridFromHTML(
            trial.capThreshold,
            trial.capDirection,
            trial.stemThreshold,
            trial.stemDirection,
            gridhtml,
            "1.5vw"
          ),
          trial.studentIdx + 1
        )
      : sprintf(
          $("#preambleFullCap").html(),
          trial.stemDirection,
          trial.stemThreshold,
          trial.capDirection,
          trial.capThreshold,
          makeGridFromHTML(
            trial.capThreshold,
            trial.capDirection,
            trial.stemThreshold,
            trial.stemDirection,
            gridhtml,
            "1.5vw"
          ),
          trial.studentIdx + 1
        );
  } else {
    return sprintf(
      $("#preamblePartial").html(),
      trial.stemDirection,
      trial.stemThreshold,
      trial.capDirection,
      trial.capThreshold,
      makeGridFromHTML(
        trial.capThreshold,
        trial.capDirection,
        trial.stemThreshold,
        trial.stemDirection,
        gridhtml,
        "1.5vw"
      ),
      trial.studentIdx + 1
    );
  }
}

// again, needed for dynamic feedback within stim function
// myHTML should be `id="preambles"`
function makeExamplePreambleFromHTML(trial, myHTML) {
  $html = $(myHTML);
  var gridhtml = $html.filter("#mushroomGrid").html()
//   console.log(gridhtml)
  if (trial.scenario === "nonSeqFull") {
    return trial.prior === "stem"
      ? sprintf(
          $html.find("#preambleFullStem").html(),
          trial.stemDirection,
          trial.stemThreshold,
          trial.capDirection,
          trial.capThreshold,
          makeGridFromHTML(
            trial.capThreshold,
            trial.capDirection,
            trial.stemThreshold,
            trial.stemDirection,
            gridhtml,
            "1.5vw"
          ),
          trial.studentIdx + 1
        )
      : sprintf(
          $html.find("#preambleFullCap").html(),
          trial.stemDirection,
          trial.stemThreshold,
          trial.capDirection,
          trial.capThreshold,
          makeGridFromHTML(
            trial.capThreshold,
            trial.capDirection,
            trial.stemThreshold,
            trial.stemDirection,
            gridhtml,
            "1.5vw"
          ),
          trial.studentIdx + 1
        );
  } else {
    return sprintf(
      $html.find("#preamblePartial").html(),
      trial.stemDirection,
      trial.stemThreshold,
      trial.capDirection,
      trial.capThreshold,
      makeGridFromHTML(
        trial.capThreshold,
        trial.capDirection,
        trial.stemThreshold,
        trial.stemDirection,
        gridhtml,
        "1.5vw"
      ),
      trial.studentIdx + 1
    );
  }
}

function makeLabels(threshold, direction, nLabels) {
  var labels = [];
  for (let label = 1; label <= nLabels; label++) {
    if (label < threshold) {
      if (direction === "less") {
        labels.push(`<b style="color: #648FFF">${label}</b>`);
      } else {
        labels.push(`<b style="color:#f77140">${label}</b>`);
      }
    } else if (label > threshold) {
      if (direction === "less") {
        labels.push(`<b style="color:#f77140">${label}</b>`);
      } else {
        labels.push(`<b style="color:#648FFF">${label}</b>`);
      }
    } else {
      labels.push(label);
    }
  }
  return labels;
}

function makeTwoMushrooms(trial) {
  // Make the labels for the forced-choice trials

  // On stem boundary
  var stemBoundaryStemVal =
    trial.stemDirection == "less"
      ? trial.stemThreshold - 0.5
      : trial.stemThreshold + 0.5;
  var stemBoundaryCapVal = trial.capDirection == "less" ? 1 : 8;

  // On cap boundary
  var capBoundaryStemVal = trial.stemDirection == "less" ? 1 : 8;
  var capBoundaryCapVal =
    trial.capDirection == "less"
      ? trial.capThreshold - 0.5
      : trial.capThreshold + 0.5;

  var stemBoundaryHTML = `<div>
    <img src='img/mushroom_s${stemBoundaryStemVal}c${stemBoundaryCapVal}.png' width="80"></img>
    <br>
    Stem height ${stemBoundaryStemVal}
    <br>
    Cap width ${stemBoundaryCapVal}
    </div>
    `;

  var capBoundaryHTML = `<div>
    <img src='img/mushroom_s${capBoundaryStemVal}c${capBoundaryCapVal}.png' width="80"></img>
    <br>
    Stem height ${capBoundaryStemVal}
    <br>
    Cap width ${capBoundaryCapVal}
    </div>
    `;

  return [stemBoundaryHTML, capBoundaryHTML];
}

function getJSON(path) {
  return fetch(path).then((response) => response.json());
}

function fetchLearnerFeedback(currTrial, stemResponse, capResponse) {
  var arr = null;

  $.ajax({
    async: false,
    global: false,
    url: "./precalc_2d_new.json",
    dataType: "json",
    success: function (data) {
      thisTrial = data.filter(
        (x) =>
          x.trueH.stemThreshold == currTrial.stemThreshold &&
          x.trueH.stemDirection == currTrial.stemDirection &&
          x.trueH.capThreshold == currTrial.capThreshold &&
          x.trueH.capDirection == currTrial.capDirection &&
          x.prior == currTrial.prior &&
          x.response.stemResponse == stemResponse &&
          x.response.capResponse == capResponse
      );

      learnerFeedback = thisTrial[0].learnerGuess;
      arr = learnerFeedback;
    },
  });

  console.log(arr);
  return arr;
}
