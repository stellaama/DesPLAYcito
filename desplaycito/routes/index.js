var express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var router = express.Router();
const axios = require('axios');


var scopes = ['user-read-private', 'user-read-email', 'user-read-birthdate', 'user-top-read', 'user-library-read',
'playlist-modify-private', 'playlist-read-private', 'playlist-modify-public','user-read-recently-played'],
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

router.post('/relatedArtistsTracks', function(req, res, next) {
  var userId = req.body.userId;
  var playlistName = req.body.playlistName;
  spotifyApi.createPlaylist(userId, playlistName)
  .then(function(data) {
    let playlistId = data.body.id;
    let plasylistUri = data.body.uri;
    console.log("playlist completed");
    spotifyApi.getMyTopArtists({limit:5})
    .then(function(data) {
      let topArtistIds = data.body.items.map(function(artist){
        return artist.id;
      });
      console.log("top artists completed");
      spotifyApi.getRecommendations({seed_artists: topArtistIds, limit: 10})
      .then(function(data) {
        let topTracksIds = data.body.tracks.map(function(track){
          return track.uri;
        });
        console.log(topTracksIds);
        spotifyApi.addTracksToPlaylist(playlistId, topTracksIds)
        .then(function(data) {
          res.json({uri: plasylistUri});
        }, function(err) {

          res.json({error: err});
        });
      }, function(err) {
        res.json({error: err});
      });
    }, function(err) {
      res.json({error: err});
    });
  }, function(err) {
    res.json({error: err});
  });
});

router.post('/topTracks', function(req, res, next) {
  var userId = req.body.userId;
  var playlistName = req.body.playlistName;
  spotifyApi.createPlaylist(userId, playlistName)
  .then(function(data) {
    let playlistId = data.body.id;
    let plasylistUri = data.body.uri;
    console.log("playlist completed");
    spotifyApi.getMyTopTracks({limit:10, time_range:"long_term"})
    .then(function(data) {
      let topTracksIds = data.body.items.map(function(track){
        return track.uri;
      });
      console.log(topTracksIds);
      spotifyApi.addTracksToPlaylist(playlistId, topTracksIds)
      .then(function(data) {
        res.json({uri: plasylistUri});
      }, function(err) {
        res.json({error: err});
      });
    }, function(err) {
    res.json({error: err});
  });
}, function(err) {
res.json({error: err});
});
});


router.post('/topArtistsTracks', function(req, res, next) {
  var userId = req.body.userId;
  var playlistName = req.body.playlistName;
  spotifyApi.createPlaylist(userId, playlistName)
  .then(function(data) {
    let playlistId = data.body.id;
    let plasylistUri = data.body.uri;
    console.log("playlist completed");
    spotifyApi.getMyTopArtists({limit:10})
    .then(function(data){
      let topArtistIds = data.body.items.map(function(artist){
        return artist.id;
      });
      let topTracksIds = topArtistIds.map(function(artistId){
        return spotifyApi.getArtistTopTracks(artistId,'US')
        .then(function(data) {
          return data.body.tracks[0].uri;
        }, function(err) {
          return "";
        });
      });
      Promise.all(topTracksIds).then(function(topTracksIds){
        spotifyApi.addTracksToPlaylist(playlistId, topTracksIds)
        .then(function(data) {
          res.json({uri: plasylistUri});
        }, function(err) {
          res.json({error: err});
        });
      });
    }, function(err) {
      res.json({error: err});
    });
  }, function(err) {
    res.json({error: err});
  });
});

router.post('/relatedTopTracks', function(req, res, next) {
  var userId = req.body.userId;
  var playlistName = req.body.playlistName;
  spotifyApi.createPlaylist(userId, playlistName)
  .then(function(data) {
    let playlistId = data.body.id;
    let plasylistUri = data.body.uri;
    console.log("playlist completed");
    spotifyApi.getMyTopTracks({limit:5})
    .then(function(data) {
      let topTracksIds = data.body.items.map(function(track){
        return track.id;
      });
      console.log("top artists completed");
      spotifyApi.getRecommendations({seed_tracks: topTracksIds, limit: 10})
      .then(function(data) {
        let topRecIds = data.body.tracks.map(function(track){
          return track.uri;
        });
        console.log(topRecIds);
        spotifyApi.addTracksToPlaylist(playlistId, topRecIds)
        .then(function(data) {
          res.json({uri: plasylistUri});
        }, function(err) {

          res.json({error: err});
        });
      }, function(err) {
        res.json({error: err});
      });
    }, function(err) {
      res.json({error: err});
    });
  }, function(err) {
    res.json({error: err});
  });
});

module.exports = router;
