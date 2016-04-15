var request = require('request').defaults({ jar: true });

var BASE_URL = 'https://api.indooratlas.com/';

var IndoorAtlasAPI = function() {
    this._userId = undefined;
};

IndoorAtlasAPI.prototype = {

    auth: function(username, password, callback) {
        var self = this;

        request({
            uri: BASE_URL + 'auth',
            method: 'POST',
            json: {
                username: username,
                password: password
            }
        }, function(err, httpResponse, body) {
            if (err) {
                return callback(err);
            }

            self._userId = body.id;
            callback(null);
        });
    },

    user: function(callback) {
        this._apiRequest({
            uri: BASE_URL + 'users/' + this._userId,
            method: 'GET'
        }, callback);
    },

    venues: function(callback) {
        this._apiRequest({
            uri: BASE_URL + 'users/' + this._userId + '/venues',
            method: 'GET'
        }, callback);
    },

    applications: function(callback) {
        this._apiRequest({
            uri: BASE_URL + 'users/' + this._userId + '/applications',
            method: 'GET'
        }, callback);
    },

    createApplication: function(options, callback) {
        if (!options || !options.name || !options.description) {
            return callback('Name and description required as options');
        }

        this._apiRequest({
            uri: BASE_URL + 'users/' + this._userId + '/applications',
            method: 'POST',
            json: {
                name: options.name,
                description: options.description
            }
        }, callback);
    },

    deleteApplication: function(applicationId, callback) {
        this._apiRequest({
            uri: BASE_URL + 'applications/' + applicationId,
            method: 'DELETE'
        }, callback);
    },

    applicationApiKeys: function(applicationId, callback) {
        this._apiRequest({
            uri: BASE_URL + 'applications/' + applicationId + '/apikeys',
            method: 'GET'
        }, callback);
    },

    // limit =
    news: function(options, callback) {
        var requestOptions = {
            uri: BASE_URL + 'news',
            method: 'GET',
        };

        if (arguments.length === 1) {
            if (typeof(options) !== 'function') {
                return callback('Callback must be provided to news');
            }
            callback = options;
        } else {
            requestOptions.qs = options;
        }

        this._apiRequest(requestOptions, callback);
    },

    sdks: function(callback) {
        this._apiRequest({
            uri: BASE_URL + 'sdks',
            method: 'GET'
        }, callback);
    },

    globalVenues: function(options, callback) {
        var requestOptions = {
            uri: BASE_URL + 'venues',
            method: 'GET'
        };

        if (arguments.length === 1) {
            if (typeof(options) !== 'function') {
                return callback('Callback must be provided to globalVenues');
            }
            callback = options;
        } else {
            requestOptions.qs = options;
        }

        this._apiRequest(requestOptions, callback);
    },

    _apiRequest: function(options, requestFunc, callback) {
        // If only two arguments were passed, we assume that the requestFunc
        // was supposed to be callback
        if (arguments.length === 2) {
            callback = requestFunc;
            requestFunc = undefined;
        }

        if (requestFunc) {
            return requestFunc(callback);
        }

        request(options, function(err, httpResponse, body) {
            if (err) {
                return callback(err);
            }

            // All responses should be JSON parsable, but if for some reason, one
            // is not, we return the body without being parsed
            try {
                if (typeof(body) !== 'object') {
                    body = JSON.parse(body);
                }

                callback(null, body);
            } catch (e) {
                callback(null, body);
            }
        });
    },

    getUserId: function() {
        return this._userId;
    },

    api: function(path, callback) {
        this._apiRequest({
            uri: BASE_URL + path,
            method: 'GET'
        }, callback);
    },

};

exports.create = function(username, password, callback) {
    var atlas = new IndoorAtlasAPI();
    atlas.auth(username, password, function(err) {
        callback(err, atlas);
    });
};
