var express = require('express');
var axios = require('axios');
var cors = require('cors');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:8000"
}));

app.get("/", function(req,res) {
  res.send("Hello World!");
});

app.get("/recentlyPlayed", function(req, res) {

  var data = {};

  axios.get(process.env.LASTFM_URL)
  .then(function(response) {
    data = response.data.recenttracks.track;
    res.send(data);
  }).catch(function(error) {
    console.log(error);
  })
});


app.get("/spotifyLink", function(req,res) {
  var title = req.query.title;
  var artist = req.query.artist;
  var album = req.query.album;

  var stringToEncode = process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

  var auth = Buffer.from(stringToEncode).toString('base64');

  const config = {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const body = {
    grant_type: 'client_credentials'
  }


  axios.post('https://accounts.spotify.com/api/token', querystring.stringify(body), config)
  .then(function(resp) {
    const searchHeader = resp.data.access_token

    const searchConfig = {
      headers: {
        'Authorization': `Bearer ${searchHeader}`
      }
    }
  
    var searchUrl = 'https://api.spotify.com/v1/search?q=track:"' + title + '"%20artist:"' + artist + +'"%20album:"' + album + '"&type=track&limit=1';
    
    axios.get(searchUrl, config)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(error) {
      console.log(error);
    });
  })
  .catch(function(error) {
    console.log(error);
  });
});

app.listen(port, function() {
  console.log("Running on port" + port);
})