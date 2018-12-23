const loadDB = require('./db.js');
const setupResolvers = require('./utils.js');

// this function will load a db and initiate our resolvers to be exported
function initResolvers() {

  loadDB().then(function(db) {
     return setupResolvers(db);
  });

};

module.exports = initResolvers;
