function makeGrid(capThreshold, capDirection, stemThreshold, stemDirection) {

    var stems = stemDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < stemThreshold}) : _.filter(_.range(1, 9), function(i) {return i > stemThreshold})
    var caps = capDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < capThreshold}) : _.filter(_.range(1, 9), function(i) {return i > capThreshold})

    stems.forEach((stemVal) => {
        caps.forEach((capVal) => {
            $(`#s${stemVal}c${capVal}`).css({
                "border": "20px solid green"
            });
        })
    })

    return $('#mushroomGrid').html()
}
