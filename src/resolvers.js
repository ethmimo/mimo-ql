const loadDB = require('./db.js');

const setupResolvers = db => {
  const resolvers = {
    Query: {
      description: () => 'Mimo GraphQL API',
      db_address: () => db.address.toString(),
      profile: async (_, { id }) => db.get(id),
      allProfiles: async (_, { }) => db.all(id)
    },
    Mutation: {
      updateProfile: async (_, { data, signature }) => {
        try{
          const json = JSON.parse(data).id;
          if (!json.id) throw new Error('Please include an ID in data')
          await db.put(signature, data);
          const profile = await db.get(json.id);
          return profile;
        }catch(e){
          throw new Error(e);
        }
      }
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
