// preload mushroom images

function images() {
    imageNames = []
    for (let s = 1; s <= 8; s++) {
        for (let c = 1; c <= 8; c++) {
            var filename = `img/mushroom_s${s}c${c}.png`
            imageNames.push(filename)
        }
    }
    return imageNames
}


function preload() {
    return {
        type: jsPsychPreload,
        images: images()
    }
}