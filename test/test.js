const loadDB = require('../src/db.js');
const KeyValueStore = require('orbit-db-kvstore');
const assert = require('assert');

let mimostore;

describe('MimoStore', () => {

	before('should create MimoStore db', async () => {
		mimostore = await loadDB();
	})

	it('should create a store of type mimostore', async () => {
		assert(mimostore.type == 'mimostore')
	});

  it('should extend kvstore', async () => {
		assert(mimostore instanceof KeyValueStore);
	});

  it('should initially be empty', async () => {
    const all = await mimostore.all();
		assert(!all.length);
	});

  it('should create a profile', async () => {
    const json = {
      id: '0x5767CCF9bf8198318759518101F81F1A1c10EEab',
      name: 'ghili',
      bio: 'gibam'
    };
    const data = JSON.stringify(json);
    const signature = '0xb3da5d62641eb72fc02f24f3570bebb94fbd46346789212f7ef98732cd4c237f0eb4c53187f81fb7787a98476dbef87bdc345a550c5c3b5532c787ad2403b4cd1b';
		await mimostore.put(signature, data);
    const profile = await mimostore.get(json.id);
    assert(JSON.stringify(profile) === JSON.stringify(json));
	});

  it('should not be empty', async () => {
    const all = await mimostore.all();
		assert(all.length > 0);
	});

  it('should not override data', async () => {
    const json = {
      id: '0x5767CCF9bf8198318759518101F81F1A1c10EEab',
      twitter: '@ghiliweld'
    };
    const data = JSON.stringify(json);
    const signature = '0xca4550a9921ec5c03d4570a772fab617a41c0804f9b822c27158055b243259f177f3ff417a72c943146c33883b4105f336853e2150effa58c3500a497d8eb77e1b';
		await mimostore.put(signature, data);
    const profile = await mimostore.get(json.id);
    console.log(profile);
    assert(JSON.stringify(profile) != JSON.stringify(json));
	});



}).timeout(100000);
