require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  sectetKey: process.env.PROTECT_KEY,
  databaseConnectionUrl: process.env.DATABASE_URL,
  databaseName: process.env.DATABASE_NAME
};
