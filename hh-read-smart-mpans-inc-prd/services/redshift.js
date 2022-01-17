var Redshift = require('node-redshift');

var client = {
  user: process.env.DBUSER,
  database: process.env.DB,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  host: process.env.HOST
};

var redshiftClient = new Redshift(client);

module.exports = redshiftClient;