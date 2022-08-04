function makeGrid(capThreshold, capDirection, stemThreshold, stemDirection) {

    var values = _.range(1, 9)

    var stems = stemDirection === 'less' ? _.filter(values, function(i) {return i < stemThreshold}) : _.filter(values, function(i) {return i > stemThreshold})
    var caps = capDirection === 'less' ? _.filter(values, function(i) {return i < capThreshold}) : _.filter(values, function(i) {return i > capThreshold})

    // clear old coloring
    // (there's probably a better way to do this w/ css children but this suffices)
    values.forEach((stemVal) => {
        values.forEach((capVal) => {
            $(`#s${stemVal}c${capVal}`).css({
                "background-color": ''
            });
        })
    })

    // add new coloring
    stems.forEach((stemVal) => {
        caps.forEach((capVal) => {
            $(`#s${stemVal}c${capVal}`).css({
                "background-color": "#648FFF"
            });
        })
    })

    return $('#mushroomGrid').html()
}

// alternate version of function for dynamic feedback (this one takes in a HTML string)
function makeGridFromHTML(capThreshold, capDirection, stemThreshold, stemDirection, myHTML) {

    $html = $(myHTML)

    var values = _.range(1, 9)

    var stems = stemDirection === 'less' ? _.filter(values, function(i) {return i < stemThreshold}) : _.filter(values, function(i) {return i > stemThreshold})
    var caps = capDirection === 'less' ? _.filter(values, function(i) {return i < capThreshold}) : _.filter(values, function(i) {return i > capThreshold})

    // clear old coloring
    // (there's probably a better way to do this w/ css children but this suffices)
    values.forEach((stemVal) => {
        values.forEach((capVal) => {
            $html.find(`#s${stemVal}c${capVal}`).css({
                "background-color": ''
            });
        })
    })

    // add new coloring
    stems.forEach((stemVal) => {
        caps.forEach((capVal) => {
            $html.find(`#s${stemVal}c${capVal}`).css({
                "background-color": "#648FFF"
            });
        })
    })

    return $html.html()
}