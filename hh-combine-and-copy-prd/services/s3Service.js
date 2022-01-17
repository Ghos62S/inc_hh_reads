const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = {
  lists3objects: async (bucketName, prefix) => {
    var params = {
      Bucket: bucketName,
      Delimiter: '/',
      Prefix: prefix,
      StartAfter: prefix,
    };

    let list = await s3.listObjectsV2(params).promise();
    console.log("List:", list);

    let keys = [];

    for (let x of list.Contents) {
      if (x.Key.toLowerCase().includes('.csv')) {
        keys.push(x.Key);
      }
    }
    
    return keys;
  }
};
