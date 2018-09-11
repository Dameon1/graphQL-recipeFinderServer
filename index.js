'use strict';
const { ApolloServer, gql } = require('apollo-server');
import express from 'express';
import bodyParser from 'body-parser';

import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';

import typeDefs from './schema';
import resolvers from './resolvers';


require('dotenv').config();
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();
const {router: recipeRouter} = require('./routes/recipes');
const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');
const {router: usersRouter} = require('./routes/users');
const {router: authRouter} = require('./routes/auth');

const jwtStrategy = require('./passport/jwt');


passport.use(jwtStrategy);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(cors({ origin: CLIENT_ORIGIN }));


// app.use('/api/users', usersRouter);
// app.use('/api/login', authRouter);
// app.use('/api/recipes', recipeRouter);


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
module.exports = { app };
// mongoose.connect('mongodb://localhost/test');

// const Cat = mongoose.model('Cat', { name: String });

// const PORT = 3000;

// const app = express();

// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context: { Cat } }));

// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
