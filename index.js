'use strict';
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');
const dbMongoose = require('./db-mongoose');
const User = require('./models/users');

const createServer = require('./createServer');
const server = createServer();

//express middlware to handle cookies (JWT)
server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

server.express.use(async (req, res, next) => {
  if(!req.userId) return next();
  const user = await User.find({ id: req.userId });
    req.user = user;
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

server.start({ cors: {
                credentials: true,
                origin: process.env.FRONTEND_URL,
                },
              },
              comp => {
                console.log(`Server is now running on port http:/localhost:${comp.port}`);
              }
);