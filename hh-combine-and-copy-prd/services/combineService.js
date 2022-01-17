const S3FileConcat = require('s3-file-concat');
const AWS = require('aws-sdk');
const bucketName = process.env.BUCKET_NAME;
const crypto = require("crypto");

const { concatFiles } = S3FileConcat({
    "region": process.env.REGION || 'eu-west-1',
    "bucket": bucketName
});

var s3 = new AWS.S3();

module.exports = {
    combineFile: async (bucketName, keys, event) => {
        console.log('keys:' + JSON.stringify(keys));
        const uniqueFileName = crypto.randomBytes(16).toString("hex");
        let folderName = getDatedFolder();
        //let folderName = event.getDatedFolder;  
        let fileName = 'INCHalfHourly/combine/interval_reads';
        let targetFileKey = `${fileName}/${folderName}/${uniqueFileName}.csv`;
       

        console.log('Target file key generated: ', targetFileKey);

        var params = {
            Bucket: bucketName,
            Key: targetFileKey
        };

        await s3.putObject(params).promise();
        await concatFiles(keys, { targetFileKey });

        return targetFileKey;
    }
};

function getDatedFolder() {
    let today = new Date();
    let year = today.getUTCFullYear();
    let month = `${today.getUTCMonth() + 1}`.padStart(2, "0");
    let day = `${today.getUTCDate()}`.padStart(2, "0");

    return `${year}${month}${day}`;
}