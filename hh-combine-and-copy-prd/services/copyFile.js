var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = {
    copyFile: async (bucketName, destBucketName, sourceFileKey, destFileKey) => {
        var params = {
            Bucket: destBucketName,
            CopySource: bucketName + "/" + sourceFileKey,
            ACL:  'bucket-owner-full-control',
            Key: destFileKey
        };

        await s3.copyObject(params).promise();
    }
};