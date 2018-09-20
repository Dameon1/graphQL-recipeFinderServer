'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  MONGODB_URI:process.env.MONGODB_URI,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL, 
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_EXPIRY : process.env.JWT_EXPIRY,  
};
 