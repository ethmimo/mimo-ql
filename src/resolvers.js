const { profiles } = require("./data.js");

const getAllProfiles = () => Object.values(profiles);

const getProfile = profileId => profiles[profileId];

const getProfiles = profileIds => getAllProfiles().profileIds.map(id => getProfile(id));

const profileFollows = profileId => profiles[profileId].following;

const followsProfile = profileId => getAllProfiles().filter(p => p.following.includes(profileId));

const save = profile => profiles[profile.id] = profile;

const changeBio = function(profile, bio) {
  profile.bio = bio;
  return profile;
}

const updateProfile = (id, bio,sig) => changeBio(getProfile(id), bio);

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
    updateProfile: (_, { id, bio, sig }) => updateProfile(id, bio, sig)
  },
  Profile: {
    id: (root) => root.id,
    name: (root) => root.name,
    bio: (root) => root.bio,
    following: (root) => root.following
  }
};

module.exports = { resolvers };
