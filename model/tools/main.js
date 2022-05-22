
var babyparse = require('babyparse');
var fs = require('fs');

var getObjValues = function (obj) {
    return Object.values(obj)
}

var supportWriter = function (s, p, handle) {
    var sLst = _.toPairs(s);
    var l = sLst.length;
    for (var i = 0; i < l; i++) {
        fs.writeSync(handle, sLst[i].join(',') + ',' + p + '\n');
    }
};

function readCSV(filename) {
    return babyparse.parse(fs.readFileSync(filename, 'utf8'),
        { header: true, skipEmptyLines: true }).data;
};

function writeCSV(jsonCSV, filename) {
    fs.writeFileSync(filename, Papa.unparse(jsonCSV) + "\n");
};

// for more manual file writing control
// config may include 'a' or 'w' flag
var openFile = function (filename, defaultConfig) {
    var config = _.isObject(defaultConfig) ? defaultConfig : { 'flag': 'w' };
    var csvFile = fs.openSync(filename, config.flag);
    return csvFile;
};

var writeLine = function (line, handle) {
    fs.writeSync(handle, line + '\n');
};

// filename may either be a string (in which case we automatically open new file) or a handle
// may pass an array of meta-data to be appended to each line
var writeMarginals = function (erp, filename, data) {
    var handle = _.isString(filename) ? openFile(filename) : filename;
    var supp = erp.support();
    supp.forEach(function (s) {
        var d = _.isEmpty(data) ? { s } : _.zipObject([data.join(',')], [s]);
        supportWriter(d, Math.exp(erp.score(s)), handle);
    });
    if (_.isString(filename))
        closeFile(handle);
};

var writeJoint = function (erp, filename) {
    var handle = openFile(filename);
    var supp = erp.support();

    // Write header
    if (_.isObject(supp[0])) {
        writeLine([_.keys(supp[0]), "prob"].join(','), handle);
    }

    // Write values
    supp.forEach(function (s) {
        writeLine([
            _.values(s),
            Math.exp(erp.score(s))
        ].join(','), handle);
    })
    closeFile(handle);
};

var closeFile = function (handle) {
    fs.closeSync(handle);
};


module.exports = {
    readCSV: readCSV,
    writeCSV: writeCSV,
    writeMarginals: writeMarginals,
    writeJoint: writeJoint,
    open: openFile,
    close: closeFile,
    writeLine: writeLine,
    getObjValues: getObjValues
};