'use strict';

const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const dbConnect = require('./db-mongoose');

function createServer() {
  return new GraphQLServer({
    typeDefs: "./schema.graphql",    
    resolvers: {
      Mutation,
      Query
    },
    introspection: true,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, dbConnect })
  });
};

module.exports = createServer;