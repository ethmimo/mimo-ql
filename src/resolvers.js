const loadDB = require('./db.js');

const setupResolvers = db => {
  const resolvers = {
    Query: {
      description: () => 'Mimo GraphQL API',
      profile: (_, { id }) => db.get(id),
    },
    Profile: {
      id: (root) => root.id,
      name: (root) => root.name,
      bio: (root) => root.bio,
      location: (root) => root.location,
      following: (root) => root.following
    }
  };

  return resolvers;
}

// this function will load a db and initiate our resolvers to be exported
function initResolvers() {

  loadDB().then(function(db) {
     return setupResolvers(db);
  });

};

module.exports = initResolvers;
