'use strict';
require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();
const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');
const jwtStrategy = require('./passport/jwt');

passport.use(jwtStrategy);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(cors({ origin: CLIENT_ORIGIN }));

if (require.main === module) {
  mongoose.connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}


const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
module.exports = { app };