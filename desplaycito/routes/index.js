var express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var router = express.Router();
const axios = require('axios');


var scopes = ['user-read-private', 'user-read-email', 'user-read-birthdate'],
  redirectUri = 'http://localhost:4000/callback/',
  clientId = 'd37b9fe897af4d8590ab7fa2bef8e863',
  clientSecret = '63ef0b75f4b047bdb3f51fec7e3ac3eb',
  state = 'desplaycito-state';

var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
  clientSecret: clientSecret
});

/* GET home page. */
router.get('/get-login-url', function(req, res, next) {
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.json({url: authorizeURL});
});

router.get('/callback', function(req, res, next) {
  var code = req.query.code;
  /*
  axios.post('https://accounts.spotify.com/api/token',{
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  },{
    headers: {  'Content-Type':'application/x-www-form-urlencoded'  }
  })*/
  spotifyApi.authorizationCodeGrant(code).then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    res.json({login: "Successful! You can close this window!"});
  },
  function(err) {
    res.json({error: err});
  });
});

router.get('/myInfo', function(req, res, next) {
  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
    res.json(data.body);
  }, function(err) {
    res.json({error: err});
  });
});

router.get('/loggedIn', function(req, res, next) {
  spotifyApi.getMe()
  .then(function(data) {
    res.json({login: true});
  }, function(err) {
    res.json({login: false});
  });
});

module.exports = router;
