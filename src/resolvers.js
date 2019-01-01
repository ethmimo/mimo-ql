const loadIpfs = require('./ipfs.js');
const Web3 = require('web3');
const initMimo = require('ethmimo');

const setupResolvers = db, web3 => {
  const resolvers = {
    Query: {
      description: () => 'db GraphQL API',
      db_address: () => db.address,
      getProfile: async (_, { id }) => db.getProfile(id),
      getProfiles: async (_, { ids }) => db.getProfiles(ids),
      allProfiles: async (_, { }) => db.allProfiles(id),
      getProfilesByName: async (_, { name }) => db.getProfilesByName(name),
      getProfileByEmoji: async (_, { emojis }) => db.getProfileByEmoji(emojis),
      isNameRegistered: async (_, { name }) => db.isNameRegistered(name),
      resolveENSName: async (_, { ensname }) => db.isNameRegistered(web3, ensname)
    },
    Mutation: {
      updateProfile: async (_, { signature, data }) => db.updateProfile(signature, data)
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

  const ipfs = await loadIpfs();
  const db = await initMimo(ipfs);
  const resolvers = setupResolvers(db, web3);
  return resolvers;

};

module.exports = initResolvers;
