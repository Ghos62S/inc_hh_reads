const listService = require('./services/s3Service');
const copyService = require('./services/copyFile');
const combineService = require('./services/combineService');
const bucketName = process.env.BUCKET_NAME;
const destBucketName = process.env.DESTINATION_BUCKET_NAME;

exports.handler = async (event, context, callback) => {
    try {
        console.log('Initiated lambda with event: ', event);

        let datedFolderName =getDatedFolder();
        let fileNameSuffix = getDateEpoch();
        // let datedFolderName = event.getDatedFolder;
        // let fileNameSuffix = event.getDateEpoch;
        let prefix = `INCHalfHourly/staging/interval_reads/${datedFolderName}/`;
        let destinationFileKey = `IntervalReads/Daily/${datedFolderName}/half_hourly_${fileNameSuffix}.csv`;
        

        console.log('Prefix generated: ', prefix);

        let objectKeys = await listService.lists3objects(bucketName, prefix);
        console.log('Objects Listed successfully', objectKeys);
        let targetFile = await combineService.combineFile(bucketName, objectKeys, event);
        console.log('Target File: ', targetFile);

        console.log('Copying file to destination: ', { bucketName, destBucketName, targetFile, destinationFileKey });
        await copyService.copyFile(bucketName, destBucketName, targetFile, destinationFileKey);
        console.log('Copying file to destination completed');
        callback(null, 'Finished copying file to destination');
    }
    catch (err) {
        console.error('Failed copying', err, err.stack);
        callback(null, 'Failed copying file to destination');
    }
};


function getDatedFolder() {
    let today = new Date();

    let year = today.getUTCFullYear();
    let month = `${today.getUTCMonth() + 1}`.padStart(2, "0");
    let day = `${today.getUTCDate()}`.padStart(2, "0");

    return `${year}${month}${day}`;
}

function getDateEpoch() {
    var d = new Date();
    var dStart = new Date(1970, 1, 1);

    return ((d.getTime() - dStart.getTime()) * 10000);
}