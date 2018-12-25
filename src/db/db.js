const loadIpfs = require('./ipfs.js');
const OrbitDB = require('orbit-db');
const MimoStore = require('../MimoStore.js');

function resolveDB(db) {
  return new Promise(resolve => {
    resolve(db);
  });
}

const loadDB = async () => {

  let orbitdb;
  let db;

  // load an instance of ipfs
  const ipfs = await loadIpfs();

  // add the MimoStore type to OrbitDB
  OrbitDB.addDatabaseType(MimoStore.type, MimoStore);

  // create an OrbitDB instance
  orbitdb = new OrbitDB(ipfs, '../orbit/mimo' + Date.now());

  // create a MimoStore instance
  db = await orbitdb.create('mimo', MimoStore.type, { write: ['*'] });

  // load the db
  await db.load();

  return db;
  //await resolveDB(db);

};

module.exports = loadDB;
