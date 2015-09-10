IndoorAtlas API
===========
## Installation
```bash
npm install indooratlas --save
```

## Requiring
```javascript
// Wait for login to complete to use the api
require('indooratlas').create('username', 'password', function(err, atlas) {

});
```
## User Data
```javascript
atlas.user(function(err, data) {
    // data contains the user data
});
```

## User Data
```javascript
atlas.user(function(err, data) {
    // data contains the user data
});
```

## Venues
Fetch global venues
```javascript
atlas.globalVenues(function(err, data) {
    // data contains the global venue data
});
```

Fetch global venues in geographic region
```javascript
atlas.globalVenues({
    latlon: '51.50232867181172,-0.05566772460937841',
    radius: 5187,
    json: true
}, function(err, data) {
    // data contains the global venue data
});
```

Fetch your user venues
```javascript
atlas.venues(function(err, data) {
    // data contains your venues
});
```

## Applications
Create an application
```javascript
atlas.createApplication({
    name: 'App name',
    description: 'Description'
}, function(err, data) {

});
```

Delete an application
```javascript
atlas.deleteApplication(applicationId, function(err, data) {

});
```

Fetch your application data
```javascript
atlas.applications(function(err, data) {

});
```

Fetch API keys for an application
```javascript
atlas.applicationApiKeys(applicationId, function(err, data) {

});
```
