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

    describe('Atlas User', function() {
        it('should receive user data', function(done) {
            atlas.user(function(err, data) {
                expect(err).to.not.exist;
                expect(data.id).to.equal(atlas.getUserId());
                console.log('atlas.user: ', data, JSON.stringify(data));
                done();
            });
        });
    });

    describe('Atlas Venues', function() {
        describe('Global Venues', function() {
            it('should receive venues', function(done) {
                atlas.globalVenues(function(err, data) {
                    expect(err).to.not.exist;
                    expect(data).to.exist;
                    console.log('atlas.globalVenues: ', data, JSON.stringify(data));
                    done();
                });
            });

            it('should receive venues within lat, lon, radius', function(done) {
                var location = {
                    latlon: '51.50232867181172,-0.05566772460937841',
                    radius: 5187,
                    json: true
                };
                atlas.globalVenues(location, function(err, data) {
                    expect(err).to.not.exist;
                    expect(data).to.exist;
                    console.log('atlas.globalVenues: within lat, lon, radius', data, JSON.stringify(data));
                    done();
                });
            });
        });

        describe('User Venues', function(done) {
            it('should receive user venues', function(done) {
                atlas.venues(function(err, data) {
                    expect(err).to.not.exist;
                    expect(data).to.be.instanceof(Array);
                    console.log('atlas.venues: ', data, JSON.stringify(data));
                    done();
                });
            });
        });
    });

    describe('Atlas Applications', function() {
        var applicationId;

        beforeEach(function(done) {
            var appName = 'Test';
            var appDescription = 'Test desc.';

            atlas.createApplication({
                name: appName,
                description: appDescription
            }, function(err, data) {
                applicationId = data.id;

                expect(err).to.not.exist;
                expect(data).to.exist;
                expect(data.id).to.exist;
                expect(data.name).to.equal(appName);
                expect(data.description).to.equal(appDescription);
                expect(data.userId).to.equal(atlas.getUserId());
                done();
            });
        });

        afterEach(function(done) {
            atlas.deleteApplication(applicationId, function(err, data) {
                expect(err).to.not.exist;
                expect(data).to.exist;
                done();
            });
        });

        it('should include new application in fetch', function(done) {
            atlas.applications(function(err, data) {
                expect(err).to.not.exist;
                expect(data).to.be.instanceof(Array);
                done();
            });
        });

        it('should fetch api keys', function(done) {
            atlas.applicationApiKeys(applicationId, function(err, data) {
                expect(err).to.not.exist;
                expect(data.length).to.equal(1);
                expect(data[0].id).to.exist;
                expect(data[0].secret).to.exist;
                done();
            });
        });
    });

    describe('Atlas SDKs', function() {
        it('should be able to fetch sdks', function(done) {
            atlas.sdks(function(err, data) {
                expect(err).to.not.exist;
                expect(data).to.exist;
                done();
            });
        });
    });
});
