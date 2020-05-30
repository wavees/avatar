// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const request = require('request');
const app = express();
const fs = require('fs');

const randomizer = require('./randomizer.js');

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', callback)
  })
}

app.get('/:token', (req, res) => {
  let token = req.params.token;
  let path = `./${randomizer(12)}.png`;
  
  download(`http://35.228.254.172:3001/files/get/${token}`, path, () => {
    fs.readFile(path, (error, file) => {
      if (file) {
        res.end(file, 'binary');
        fs.unlink(path, () => {
          console.log("DELETED FILE");
        });
      } else {
        res.status(500).end(JSON.stringify({ error: "ServerError" }));
      }
    });
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
