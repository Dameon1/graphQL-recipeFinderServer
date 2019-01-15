'use strict';

module.exports = {
  PORT: process.env.PORT || 4001,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  MONGODB_URI:process.env.MONGODB_URI || 'http://localhost:8080',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL, 
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_EXPIRY : process.env.JWT_EXPIRY,
  MASHAPE_KEY : process.env.MASHAPE_KEY  
};
 