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

  async set (data, signature) {
    throw new Error('set cannot be called directly');
  }

  /*** Add data to a profile
   *
   * @param     {Object}    data       The new data to be added to the profile
   * @param     {String}    signature        A signature of the data
   */
  async put(signature, data) {
    // if (!data) throw new Error('Data must be included');
    // if (!signature) throw new Error('A signature must be included');
    try {
      const id = this.recover(signature, data);
      const json = JSON.parse(data);
      // if (json.id != id) throw new Error('Wrong ID generated');
      let profile = await this.get(id);
      profile = Object.assign((profile == null ? {} : profile), json);
      return this._addOperation({
      op: 'PUT',
      key: id,
      value: profile
    })
    } catch (e) {
      console.log(e);
    }
  }

  all() {
    return Object.values(this._index._index);
  }

  /**
   * Recovers the signer of the data
   *
   * @param     {String}    data         The data we signed
   * @param     {String}    signature    A signature of the data
   * @returns   {String}                 The Ethereum address that signed the data
   */
  recover(signature, data) {
    return EthCrypto.recover(signature, EthCrypto.hash.keccak256(data));
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
