var express = require('express');
var axios = require('axios');
var cors = require('cors');
var port = process.env.PORT || 3000;

var app = express();

app.use(cors({
  origin: "https://www.leema.ca"
}));

app.get("/", function(req,res) {
  res.send("Hello World!");
})

app.get("/recentlyPlayed", function(req, res) {
  axios.get(process.env.LASTFM_URL)
  .then(response => {
    res.send(response);
  });
})

app.listen(port, function() {
  console.log("Running on port" + port);
})