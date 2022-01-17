const batchSize = process.env.BATCH_SIZE;
const databaseService = require("./services/redshiftService");
const sendMessage = require("./services/sqsSendService");
const splitService = require("./services/splitService");
var QUEUE_URL = process.env.QUEUE_URL;

exports.handler = async (event, context, callback) => {
   try {
      let dbQuery = 'select  distinct(mpan) as mpxn from inc.live_inc_devices';
      let databaseResult = await databaseService.executeQuery(dbQuery);

      console.log("Data result :", databaseResult);

      if (databaseResult.length <= 0) {
         const msg = 'No MPAN received from DB';
         console.warn(msg);
         throw new Error(msg);
      }

      let splitBatch = splitService.splitMessage(databaseResult, Number(batchSize));
      await sendMessage.sqsSendService(splitBatch, QUEUE_URL);

      let resultObj = {
         status: 'Queued MPANs for processing'
      };

      console.log(resultObj);
      callback(null, resultObj);
   } catch (err) {
      console.error('Error occurred: ', err);

      callback(null, { status: 'Failed' });
   }
};