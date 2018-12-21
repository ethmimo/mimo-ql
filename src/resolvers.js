const { profiles } = require("./data.js");

const getAllProfiles = () => Object.values(profiles);

const getProfile = profileId => profiles[profileId];

const getProfiles = profileIds => getAllProfiles().profileIds.map(id => getProfile(id));

const profileFollows = profileId => profiles[profileId].following;

const followsProfile = profileId => getAllProfiles().filter(p => p.following.includes(profileId));

const save = profile => profiles[profile.id] = profile;

const updateProfile = function(data, sig) {
  data = JSON.parse(data);
  const profile = getProfile(data.id);
  Object.assign(profile, data);
  save(profile);
  return profile;
}

const resolvers = {
  Query: {
    description: () => 'Mimo GraphQL API',
    profile: (_, { id }) => getProfile(id),
    profiles: (_, { ids }) => getProfiles(ids),
    allProfiles: () => getAllProfiles(),
    profileFollows: (_, { id }) => profileFollows(id),
    followsProfile: (_, { id }) => followsProfile(id),
  },
  Mutation: {
    updateProfile: (_, { data, sig }) => updateProfile(data, sig)
  },
  Profile: {
    id: (root) => root.id,
    name: (root) => root.name,
    bio: (root) => root.bio,
    location: (root) => root.location,
    following: (root) => root.following
  }
};

module.exports = { resolvers };
