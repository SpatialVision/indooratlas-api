/**
 * Created by hxg on 15/04/16.
 https://api.indooratlas.com/floorplans/2559951f-8470-46c1-8d32-2983e6636d71
 https://api.indooratlas.com/floorplans/2559951f-8470-46c1-8d32-2983e6636d71/map_status
 */

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
    describe('Floor plans', function(done) {
      var path = 'floorplans/2559951f-8470-46c1-8d32-2983e6636d71';
      it('should receive SV office colour: ' + path, function(done) {
        atlas.api(path, function(err, data) {
          expect(err).to.not.exist;
          expect(data).to.be.instanceof(Object);
          var out = JSON.stringify(data,null,2);
          var file = 'results/floorplans.json';
          console.log('atlas.venues: ', data, out);

          jsonfile.writeFile(file, data, {spaces: 2}, function(err) {
            console.error('err? ', err)
            done();
          })
        });
      });

      var path2 = 'floorplans/2559951f-8470-46c1-8d32-2983e6636d71/map_status';
      it('should receive SV office colour: ' + path2, function(done) {
        atlas.api(path2, function(err, data) {
          expect(err).to.not.exist;
          expect(data).to.be.instanceof(Object);
          var out = JSON.stringify(data,null,2);
          var file = 'results/floorplans-map_status.json';
          console.log('atlas.venues: ', data, out);

          jsonfile.writeFile(file, data, {spaces: 2}, function(err) {
            console.error('err? ', err)
            done();
          })
        });
      });

    });
  });

});
