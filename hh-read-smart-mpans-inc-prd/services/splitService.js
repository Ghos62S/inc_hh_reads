const splitArray = require("split-array");

function splitMessage(databaseResult, batchSize) {
    const resultLength = databaseResult.length;
    const spilttedArray = splitArray(databaseResult, batchSize);
    let sqsMessage = [];

    if (resultLength > batchSize) {
        for (const databaseResult of spilttedArray) {
            sqsMessage.push((databaseResult));
        }
    }

    else {
        sqsMessage.push((databaseResult));

        return sqsMessage;
    }

    return sqsMessage;
}

module.exports = {
    splitMessage: splitMessage
};
