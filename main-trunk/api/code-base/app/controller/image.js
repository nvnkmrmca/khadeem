"use strict";

const fs = require('fs');
const url = require('url');

// serve image
exports.serve = (req, res) => {
    var request = url.parse(req.url, true);
    var img = fs.readFileSync('./assets' +  request.pathname);
    // res.writeHead(200, {'Content-Type': 'image/gif' });
    // res.end(img, 'binary');
    res.status(200).send(img);
  };