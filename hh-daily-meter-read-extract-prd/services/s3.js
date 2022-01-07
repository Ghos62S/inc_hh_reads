const AWS = require('aws-sdk');
AWS.config.region = process.env.REGION || 'eu-west-1';
const s3 = new AWS.S3();

module.exports = {
    /**
    * Gets the data result of s3 select
    * @param {string} bucket the bucket for the source file
    * @param {string} key the key for the source file
    * @param {string} expression the SQL expression that needs to be executed
    * @returns {Promise<string>} the data in string for the query executed
    */
    getDataWithExpressionFromCsvAsync: async (bucket, key, expression) => {
        const params = {
            Bucket: bucket,
            Key: key,
            ExpressionType: 'SQL',
            Expression: expression,
            InputSerialization: {
                CSV: {
                    FileHeaderInfo: 'USE',
                    RecordDelimiter: '\n',
                    FieldDelimiter: ','
                }
            },
            OutputSerialization: {
                CSV: {}
            }
        };

        let data = '';

        let response = await s3.selectObjectContent(params).promise();
        const events = response.Payload;

        for await (const event of events) {
            if (event.Records) {
                data += event.Records.Payload.toString();
            }
        }

        return data;
    },

    /**
    *Uploads given data to s3
    * @param {string} bucket the destination bucket
    * @param {string} key the key for the destination file
    * @param {any} data the data to be uploaded
    * @returns {any} the s3 put object response
    */
    uploadToS3Async: async (bucket, key, data) => {

        let params = {
            Bucket: bucket,
            Key: key,
            Body: Buffer.from(data, 'binary')
        };

        return await s3.putObject(params).promise();
    },

    /**
    * List all the keys from the given prefix
    * @param {string} bucket the source bucket
    * @param {string} prefix the prfix key for the source file
    * @returns {Promise<string>} the s3 key for the object
    */
    listAllS3ObjectsAsync: async (bucket, prefix) => {
        const params = {
            Bucket: bucket,
            Delimiter: '/',
            Prefix: prefix,
            StartAfter: prefix
        };

        let lists = await s3.listObjectsV2(params).promise();
        let keys = [];

        console.log('Key contents: ', prefix, lists)

        for (let x of lists.Contents) {
            keys.push(x.Key);
        }

        return keys;
    }
};
