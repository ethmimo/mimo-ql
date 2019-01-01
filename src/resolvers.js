const loadDB = require('./db.js');
const Web3 = require('web3');
const Mimo = require('./mimo.js');

const setupResolvers = db, web3 => {
  const resolvers = {
    Query: {
      description: () => 'Mimo GraphQL API',
      db_address: () => Mimo.address(db),
      getProfile: async (_, { id }) => Mimo.getProfile(db, id),
      getProfiles: async (_, { ids }) => Mimo.getProfiles(db, ids),
      allProfiles: async (_, { }) => Mimo.allProfiles(db, id),
      getProfilesByName: async (_, { name }) => Mimo.getProfilesByName(db, name),
      getProfileByEmoji: async (_, { emojis }) => Mimo.getProfileByEmoji(db, emojis),
      isNameRegistered: async (_, { name }) => Mimo.isNameRegistered(db, name),
      resolveENSName: async (_, { ensname }) => Mimo.isNameRegistered(db, web3, ensname)
    },
    Mutation: {
      updateProfile: async (_, { signature, data }) => Mimo.updateProfile(db, signature, data)
    },
    Profile: {
      id: (root) => root.id,
      name: (root) => root.name,
      bio: (root) => root.bio
    }
  };

  return resolvers;
}

// this function will load a db and initiate our resolvers to be exported
async function initResolvers(web3 = {}) {

  let resolvers = await loadDB().then(db => setupResolvers(db, web3)).catch(e => console.log(e));

  return resolvers;
};

module.exports = initResolvers;
