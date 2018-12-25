const IPFS = require("ipfs");

// Configuration for IPFS instance
const ipfsConfig = {
  repo: '../../orbit/ipfs',
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
};

const loadIpfs = async () => {
  return new Promise((resolve, reject) => {
    // Create IPFS instance
    const ipfs = new IPFS(ipfsConfig);

    ipfs.on("error", e => console.error(e));
    ipfs.on("ready", async () => {
      try {
        resolve(ipfs);
      } catch (e) {
        reject(e);
      }
    });
  });
};

module.exports = loadIpfs;
