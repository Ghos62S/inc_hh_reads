var AWS = require('aws-sdk');

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: process.env.REGION || "eu-west-1"
});

module.exports = {
    getSecretById: async (secretId) => {
        let secret = '';
        try {
            let data = await client.getSecretValue({ SecretId: secretId }).promise();

            if ('SecretString' in data) {
                secret = data.SecretString;
            } else {
                let buff = new Buffer(data.SecretBinary);
                secret = buff.toString('ascii');
            }
        } catch (err) {
            console.log('Error occurred while fetching secret', err.code);
            throw err;
        }

        return secret;
    }
};
