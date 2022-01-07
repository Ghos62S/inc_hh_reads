const s3Service = require('../services/s3');
const workingFolder = 'INCHalfHourly/staging/interval_reads';
const crypto = require("crypto");

module.exports = {
    /**
   * Gets the daily half hourly read interval key from RAC
   *
   * @param {string} bucketName buket name to generate the daily interval key
   * @returns {Promise<string>} the key for the daily interval read csv file
   */
    getS2DailyIntervalReadKey: async (bucketName) => {
        let s3Prefix;

        if (process.env.S3PREFIX) {
            s3Prefix = process.env.S3PREFIX;
        }
        else {
            let folderName = getDatedFolder();
            s3Prefix = `MDMS/INTERVAL_READS/STAGE_DAY/${folderName}000000/SMETS2ESME/`;
        }

        let s3ObjectKeys = await s3Service.listAllS3ObjectsAsync(bucketName, s3Prefix);

        let keyValue = '';

        for (let objectKey of s3ObjectKeys) {
            if (objectKey.includes('.csv')) {
                keyValue = objectKey;
            }
        }

        return keyValue;
    },

    /**
    * Gets the key to store the staging data with file name
    * @returns {string} the key for the daily interval staging csv file
    */
    getDailyIntervalStagingKey: () => {
        let folderName = getDatedFolder();
        let fileNamePrefix = crypto.randomBytes(16).toString("hex");
       
        return `${workingFolder}/${folderName}/hh_read_${fileNamePrefix}.csv`;
    },

    /**
    * Gets the staging key 
     * @returns {string} the of the daily interval staging
    */
    getDailyIntervalStagingFolderKey: () => {
        let folderName = getDatedFolder();

        return `${workingFolder}/${folderName}/`;
    }
};

function getDatedFolder() {
    let today = new Date();

    let year = today.getUTCFullYear();
    let month = `${today.getUTCMonth() + 1}`.padStart(2, "0");
    let day = `${today.getUTCDate()}`.padStart(2, "0");

    return `${year}${month}${day}`;
}