const { GraphQLServer } = require('graphql-yoga');

const initResolvers = require('./resolvers.js');
const typeDefs = require('./typedefs/index.js');

async function init() {
  const resolvers = await initResolvers().catch(e => console.log(e));

  const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
  });

  server.start({ port: 8000 }, ({ port }) => console.log(`Server started, listening on port ${port} for incoming requests.`));
};

init().catch(e => console.log(e));
