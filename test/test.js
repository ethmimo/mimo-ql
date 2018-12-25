require('babel-register');

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import EthCrypto from 'eth-crypto';

const timeout = 5000;
chai.use(chaiHttp);

let identity;
let name;

describe('Orbit GraphQL', () => {

    before(async () => {
        identity = EthCrypto.createIdentity();
        name = "moskalyk";
    })

    it('should get all profiles', async () => {
        const query = `
            query {
              allProfiles{
                id
              }
            }
        `;
        const res = await chai.request('http://localhost:4000').post(`/`).send({query: query});
        expect(res).to.have.status(200);
        expect(res.body.data.allProfiles == []);
    });

    it('should add a profile', async () => {
        const messageHash = EthCrypto.hash.keccak256(name + identity.publicKey);

        const sig = EthCrypto.sign(
            identity.privateKey, 
            messageHash // 
        );

    	const mutation = `
    		mutation {
              createProfile(id: "1", name: "${name}", bio: "anon.", sig: "${sig}"){
                bio
                id
                name
              }
            }
    	`;
		const res = await chai.request('http://localhost:4000').post(`/`).send({query: mutation});
        expect(res).to.have.status(200);
        expect(res.body.data.createProfile.name).to.be.equal(name);
    }).timeout(timeout);

    it('should get all profiles', async () => {
        const query = `
            query {
              allProfiles{
                id
                name
              }
            }
        `;
        const res = await chai.request('http://localhost:4000').post(`/`).send({query: query});
        expect(res).to.have.status(200);
        expect(res.body.data.allProfiles.length > 0);
    });

});