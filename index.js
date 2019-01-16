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
  mongoose.connect(MONGODB_URI,{ useNewUrlParser: true })
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });
}


const server = new ApolloServer({
  cors:false,
  typeDefs,
  resolvers,
  context: ({ req,res }) => ({req,res})
  
    // // get the user token from the headers
    // const token = req.headers.authorization || '';
    
    // // try to retrieve a user with the token
    // const user = getUser(token);
    
    // // add the user to the context
    // return { user };

});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
module.exports = { app };