const loadDB = require('./db.js');
const emojihash = require('web3-emojihash');

const setupResolvers = db => {
  const resolvers = {
    Query: {
      description: () => 'Mimo GraphQL API',
      db_address: () => db.address.toString(),
      getProfile: async (_, { id }) => db.get(id),
      allProfiles: async (_, { }) => db.all(id),
      // getProfilesByName: async (_, { name }) => db.all(id).filter(p => p.name = name),
      // getProfileByEmoji: async (_, { emojis }) => db.all(id).find(p => emojihash(p.id) = emojis),
      // isProfileRegistered: async (_, { name }) => getProfilesByName().then(ps => ps.length > 0)
      // ^^^ can I do this?
    },
    Mutation: {
      updateProfile: async (_, { signature, data }) => {
        try{
          const id = JSON.parse(data).id;
          if (!id) throw new Error('Please include an ID in data')
          await db.put(signature, data);
          const profile = await db.get(id);
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
