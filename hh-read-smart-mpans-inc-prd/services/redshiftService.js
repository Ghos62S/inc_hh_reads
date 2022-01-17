var Redshift = require('node-redshift');
var secretService = require('./secretService');
const secretId = 'db/analytics-redshift-key';

module.exports = {
    executeQuery: async (query) => {

        let secret = await secretService.getSecretById(secretId);

        let parsedSecret = JSON.parse(secret);

        var client = {
            user: process.env.DBUSER,
            database: process.env.DB,
            password: parsedSecret.inc_user,
            port: process.env.DBPORT,
            host: process.env.HOST
        };

        var redshiftClient = new Redshift(client);

        let data = await redshiftClient.query(query, { raw: false });

        return Object.values(JSON.parse(JSON.stringify(data.rows)));
    }
};
