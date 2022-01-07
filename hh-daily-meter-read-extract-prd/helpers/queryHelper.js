module.exports = {
    /**
   * Gets the S3 Select Query based on the MPANs provided. 
   * Generates s3 select query to select MPXN, MSN,READ_DATE_TIME,READ_VALUE,READ_TYPE for the MPANs provided.
   * @param {Array} mpans The list of MPANs
   * @returns {string} S3 select query based on the list of MPANs provided
   */
    getS2MeterReadS3SselectQuery: (mpans) => {
        let mpanList = '';

        mpans.forEach(mpan => {
            mpanList += `'${mpan}',`;
        });

        let finalQuery = mpanList.slice(0, -1);

        let queryTemplate = `select MPXN, MSN,READ_DATE_TIME,READ_VALUE,READ_TYPE from S3Object S WHERE S.MPXN in (${finalQuery})`;

        return queryTemplate;
    }
};
