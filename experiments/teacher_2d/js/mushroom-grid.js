function makeGrid(capThreshold, capDirection, stemThreshold, stemDirection) {
    // console.log($('#mushroomContainer').children('img'))
    // $('#mushroomContainer').children('*').css({
    //     "background-color": ""
    // })
    var values = _.range(1, 9)

    var stems = stemDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < stemThreshold}) : _.filter(_.range(1, 9), function(i) {return i > stemThreshold})
    var caps = capDirection === 'less' ? _.filter(_.range(1, 9), function(i) {return i < capThreshold}) : _.filter(_.range(1, 9), function(i) {return i > capThreshold})


    // var left = 12.5 * _.min(stems)
    // var right = 12.5 * _.max(stems)
    // var width = right - left
    // var top = 100 - 12.5 * _.min(caps)
    // var bottom = 100 - 12.5 * _.max(caps)
    // var height = top - bottom

    // $('#mushroomContainer').append('<div class="tastyMushrooms”></div>');
    // $('.tastyMushrooms').css({'top': sprintf('%s%%', top),
    //                             'right': sprintf('%s%%', right),
    //                             'width': sprintf('%s%%', width),
    //                             'height': sprintf('%s%%', height),
    //                             'bottom': sprintf('%s%%', bottom),
    //                             'left': sprintf('%s%%', left),
    //                         });
    // var htmlCopy = $('#mushroomGrid').html()


    console.log(capThreshold)
    console.log(capDirection)
    console.log(stemThreshold)
    console.log(stemDirection)

    // clear old stuff
    values.forEach((stemVal) => {
        values.forEach((capVal) => {
            // console.log(stemVal)
            // console.log(capVal)
            $(`#s${stemVal}c${capVal}`).css({
                "background-color": ''
            });
        })
    })

    stems.forEach((stemVal) => {
        caps.forEach((capVal) => {
            // console.log(stemVal)
            // console.log(capVal)
            $(`#s${stemVal}c${capVal}`).css({
                "background-color": "#648FFF"
            });
        })
    })

    return $('#mushroomGrid').html()
}
