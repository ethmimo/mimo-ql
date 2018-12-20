const { profiles } = require("./data.js");

const getAllProfiles = () => Object.values(profiles);

const getProfile = profileId => profiles[profileId];

const getProfiles = profileIds => getAllProfiles().profileIds.map(id => getProfile(id));

const profileFollows = profileId => profiles[profileId].following;

const followsProfile = profileId => getAllProfiles().filter(p => p.following.includes(profileId));

const resolvers = {
  Query: {
    description: () => 'Mimo GraphQL API',
    profile: (_, { id }) => getProfile(id),
    profiles: (_, { ids }) => getProfiles(ids),
    allProfiles: () => getAllProfiles(),
    profileFollows: (_, { id }) => profileFollows(id),
    followsProfile: (_, { id }) => followsProfile(id),
  },
  Profile: {
    id: (root) => root.id,
    name: (root) => root.name,
    bio: (root) => root.bio,
    following: (root) => root.following
  }
};

module.exports = { resolvers };
