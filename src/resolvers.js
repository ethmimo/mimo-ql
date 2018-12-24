const loadDB = require('./db.js');

const setupResolvers = db => {
  const resolvers = {
    Query: {
      description: () => 'Mimo GraphQL API',
      profile: (_, { id }) => db.get(id),
      allProfiles: (_, { }) => db.all()
    },
    Profile: {
      id: (root) => root.id,
      name: (root) => root.name,
      bio: (root) => root.bio,
    }
  };

  return resolvers;
}

// this function will load a db and initiate our resolvers to be exported
async function initResolvers() {

  let resolvers = await loadDB().then(db => setupResolvers(db)).catch(e => console.log(e));

  return resolvers;
};

module.exports = initResolvers;
