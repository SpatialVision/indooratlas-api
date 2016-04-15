/**
 * Using .exist as a property instead of a function makes jshint unhappy!
 */
/*jshint -W030 */

var config;
try {
  config = require('./user-config.json');
} catch(e) {
  console.log('A configuration file must be generated in order to run these tests.\n' +
    'The config must include a username and password to run the tests against.\n' +
    'Run the following command, and then modify the fields:\n\n' +
    'cp test/user-config.template.json test/user-config.json\n');
  process.exit(1);
}

var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var jsonfile = require('jsonfile')

describe('IndoorAtlas API', function() {
  this.timeout(10000);
  var atlas;

  before(function(done) {
    require('../').create(config.username, config.password, function(err, indooratlas) {
      atlas = indooratlas;
      expect(err).to.not.exist;
      expect(atlas).to.exist;
      done();
    });
  });

  describe('Atlas Venues', function() {
    describe('User Venues', function(done) {
      it('should receive user venues', function(done) {
        atlas.venues(function(err, data) {
          expect(err).to.not.exist;
          expect(data).to.be.instanceof(Array);
          var out = JSON.stringify(data,null,2);
          var file = 'results/user-venues.json';
          console.log('atlas.venues: ', data, out);
          jsonfile.writeFile(file, data, {spaces: 2}, function(err) {
            console.error('err? ', err)
          })
          done();
        });
      });
    });
  });

});
