const { GraphQLServer } = require('graphql-yoga');

const initResolvers = require('./resolvers.js');
const typeDefs = require('./typedefs/index.js');

async function init() {
  const resolvers = await initResolvers().catch(e => console.log(e));

  const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
  });

  server.start(() => console.log(`The server is running on http://localhost:4000`));
};

init().catch(e => console.log(e));
