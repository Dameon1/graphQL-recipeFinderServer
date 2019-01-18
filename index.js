'use strict';
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');

const createServer = require('./createServer');
const dbMongoose = require('./db-mongoose');
const jwt = require('jsonwebtoken');
const server = createServer();
const User = require('./models/users');
//express middlware to handle cookies (JWT)
server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if(token){
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
    console.log(userId) 
  }
  next();
});

server.express.use(async (req, res, next) => {
  if(!req.userId) return next();
  const user = await User.find({ id: req.userId });
    req.user = user;
    console.log((user))
    next();
});
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

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
// require('dotenv').config();
// const { ApolloServer, gql } = require('apollo-server');
// const typeDefs = require('./schema');
// const resolvers = require('./resolvers');
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const app = express();
// const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');
// const jwtStrategy = require('./passport/jwt');

// passport.use(jwtStrategy);

// app.use(express.json());
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
// app.use(cors({ origin: CLIENT_ORIGIN }));

// if (require.main === module) {
//   mongoose.connect(MONGODB_URI,{ useNewUrlParser: true })
//     .then(instance => {
//       const conn = instance.connections[0];
//       console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
//     })
//     .catch(err => {
//       console.error(`ERROR: ${err.message}`);
//       console.error('\n === Did you remember to start `mongod`? === \n');
//       console.error(err);
//     });
// }


// const server = new ApolloServer({
//   cors: {
//     credentials: true,
//     origin: "http://localhost:3000",
//   },
//   typeDefs,
//   resolvers,
//   context: ({ req,res }) => ({req,res})
  
//     // // get the user token from the headers
//     // const token = req.headers.authorization || '';
    
//     // // try to retrieve a user with the token
//     // const user = getUser(token);
    
//     // // add the user to the context
//     // return { user };

// });
// server.use((req, res, next) => {
//   const { token } = req.cookies;
//   if(token){
//     const { userId } = jwt.verify(token, process.env.APP_SECRET);
//     req.userId = userId; 
//   }
//   console.log(req.userId)
//   next();
// });

// server.use(async (req, res, next) => {
//   if(!req.userId) return next();
//   const user = await User.find({ id: req.userId });
//     req.user = user;
//     console.log(req.user)
//     next();
// });


// server.listen({ port: 4001 }).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });
// module.exports = { app };