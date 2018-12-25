const KeyValueStore = require('orbit-db-kvstore');
const EthCrypto = require('eth-crypto');

class MimoStore extends KeyValueStore {

  /**
   * Instantiates a MimoStore
   *
   * @param     {IPFS}      ipfs            An IPFS instance
   * @param     {String}    dbname          The DB name, should be 'mimo'
   * @return    {MimoStore}                 self
   */
  constructor(ipfs, id, dbname, options) {
    super(ipfs, id, dbname, options);
    this._type = MimoStore.type;
  }

  set (data, signature) {
    throw new Error('set cannot be called directly');
  }

  /*** Add data to a profile
   *
   * @param     {Object}    data       The new data to be added to the profile
   * @param     {String}    signature  A signature of the data
   */
  async put(data, signature) {
    if (!data) throw new Error('Data must be included');
    if (!data.name) throw new Error('A name must be included');
    if (!signature) throw new Error('A signature must be included');
    const signer = this.recover(data, signature);
    data.id = await this.getID(data.name, signer);
    let profile = await this.get(data.id);
    
    profile = Object.assign((profile == null ? {} : profile), data);
    
    // Register and add profile
    if(!this.isRegistered(data.name, data.id)){
      await this.register(data.name, profile)
    }else{
      await super.put(data.id, profile);
    }
  }

  async get(id) {
    return await super.get(id);
  }

  all() {
    return Object.keys(this._index._index).map(p => this._index._index[p], this)
  }

  async del(name, signature) {
    const signer = recover('delete profile: ${name}', signature);
    const id = getID(name, signer);
    await super.del(id);
  }

  /**
   * Check if a profile is registered
   *
   * @param     {Object}    data         The data we signed
   * @param     {String}    signature          A signature of the data
   * @returns   {Boolean}                Was the data signed by the owner?
   */
  async isRegistered(name, owner) {
    const id = this.getID(name, owner);
    const profile = await this.get(id);
    return profile != undefined;
  }

  /*
   * Register a profile
   *
   * @param     {String}    name         The data we signed
   * @param     {Object}    profile      Data we want to add
   */
  async register(name, profile) {
    const id = this.getID(name, profile);
    console.log('id');
    console.log(id);
    await super.put(id, profile);
  }

  /**
   * Get a profile's ID
   *
   * @param     {String}    name         The name of the profile
   * @param     {String}    owner        A public key
   * @returns   {String}                 The profile ID
   */
  getID(name, owner) {
    return EthCrypto.hash.keccak256(name + owner);
  }

  /**
   * Recovers the signer of the data
   *
   * @param     {Object}    data         The data we signed
   * @param     {String}    signature    A signature of the data
   * @returns   {String}                 The Ethereum address that signed the data
   */
  recover(data, signature) {
    if (data instanceof String) {
      return EthCrypto.recover(signature, EthCrypto.hash.keccak256(data));
    } else {
      return EthCrypto.recover(signature, EthCrypto.hash.keccak256(JSON.stringify(data)));
    }
  }

  /**
   * Get the type of the database
   *
   * @returns   {String}                 The type of the DB, returns 'mimo'
   */
  static get type() {
    return 'mimostore';
  }
}

module.exports = MimoStore;
