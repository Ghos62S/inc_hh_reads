const racHelper = require('../helpers/racHelper');
const queryHelper = require('../helpers/queryHelper');
const s3Helper = require('./s3');
const racBucketName = process.env.BUCKET;

module.exports = {
    /**
   * Gets the SMETS2 Interval Reads for the give MPANs from RAC S3. 
   * @param {Array} mpans The list of MPANs
   * @returns {Promise<string>} S3 select query based on the list of MPANs provided
   */
    getS2MeterReadsForMpans: async (mpans) => {
        let s3SelectQuery = queryHelper.getS2MeterReadS3SselectQuery(mpans);
        console.log('S3 Select query prepared:', s3SelectQuery);
        let key = await racHelper.getS2DailyIntervalReadKey(racBucketName);
        console.log('RAC Key for reads', key);
        let reads = await s3Helper.getDataWithExpressionFromCsvAsync(racBucketName, key, s3SelectQuery);

        return reads;
    },

    /**
   * Export the given reads to an s3 location. 
   * @param {string} reads The interval reads
   * @returns {Promise<any}> S3 Upload result
   */
    exportMeterReadsAsCSV: async (reads) => {
        let key = racHelper.getDailyIntervalStagingKey();
        let result = await s3Helper.uploadToS3Async(racBucketName, key, reads);

        return result;
    }
};
