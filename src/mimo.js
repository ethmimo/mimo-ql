const emojihash = require('web3-emojihash');

class Mimo {

  constructor() { }

  static address(db) {
    return db.address.toString();
  }

  static async getAllProfiles(db) {
    return db.all();
  }

  static async getAllIDs(db) {
    return db.allIDs();
  }

  static async getProfile(db, id) {
    return db.get(id);
  }

  static async getProfiles(db, ids) {
    const profiles = ids.map(async id => await getProfile(db, id));
    return profiles;
  }

  static async getProfilesByName(db, name) {
    return this.getAllProfiles(db).filter(profile => profile.name = name);
  }

  static async getProfileByEmoji(db, emojis) {
    return this.getAllIDs(db).find(id => emojihash(id) == emojis);
  }

  static async isNameRegistered(db, name) {
    return this.getProfilesByName(db, name).length > 0;
  }

  static async resolveENSName(db, web3, ensname) {
    const owner = web3.eth.ens.registry.owner(ensname);
    return await getProfile(db, owner);
  }

  // static async getMutualFollows(db, id1, id2) {
  //   const first = await getProfile(db, id1);
  //   const second = await getProfile(db, id2);
  //   const mutuals = first.following.filter(f => second.following.includes(f));
  //   return await getProfiles(db, mutuals);
  // }

  static async updateProfile(db, signature, data) {
    try{
      const { id } = await db.put(signature, data);
      return await db.get(id);
    }catch(e){
      throw new Error(e);
    }
  }

}

module.exports = Mimo;
