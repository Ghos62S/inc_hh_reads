const racService = require('./services/racService');

exports.handler = async (event, context, callback) => {
    let batchId = '';

    try {
        console.log('Event Received', event);

        let mpanDetails = event.Records[0].body;
        let parsedBody = JSON.parse(mpanDetails);
        let mpans = [];
        let batchId = parsedBody.batchId;

        parsedBody.mpxnDetails.forEach(mpanDetail => {
            mpans.push(mpanDetail.mpxn);
        });

        if (mpans.length <= 0) {
            const msg = 'No MPAN present in the request';
            console.warn(msg);
            throw new Error(msg);
        }

        let data = await racService.getS2MeterReadsForMpans(mpans);

        if (data) {
            await racService.exportMeterReadsAsCSV(data);
        } else {
            console.warn('No data present for given MPANS: ', mpans);
        }

        let resultObj = {
            status: 'Success',
            batchId: batchId
        };

        console.log('Finished processing', resultObj);

        callback(null, resultObj);
    }
    catch (err) {
        console.error('Error occurred while processing the event', err);
        callback(null, { status: 'Failed', batchId: batchId });
    }
};