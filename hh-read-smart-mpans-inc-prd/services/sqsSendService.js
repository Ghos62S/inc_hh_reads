var AWS = require('aws-sdk');
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const crypto = require("crypto");

async function sqsSendService(splitBatch, QUEUE_URL) {
    let batchLength = splitBatch.length;
    const batchId = crypto.randomBytes(16).toString("hex");

    for (var i = 0; i < batchLength; i++) {

        let messageObj = {
            mpxnDetails: splitBatch[i],
            batchLength: batchLength,
            batchId: batchId
        };

        let params = {
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(messageObj)
        };

        await sqs.sendMessage(params).promise();
    }
}

module.exports = {
    sqsSendService: sqsSendService
};
