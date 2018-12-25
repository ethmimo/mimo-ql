const loadDB = require('../db/');

const setupResolvers = db => {
  const resolvers = {
    Query: {
      description: () => 'Mimo GraphQL API',
      profile: async (_, { id }) => await db.get(id),
      allProfiles: async (_, { }) => await db.all()
    },
    Profile: {
      id: (root) => root.id,
      name: (root) => root.name,
      bio: (root) => root.bio,
    },
    Mutation: {
      createProfile: async (_, { id, name, bio, sig}) => {
        try{
          await db.put({id, name, bio}, sig);
          return {id, name, bio};
        }catch(e){
          throw new Error(e);
        }
      }
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
