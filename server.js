const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();
 
const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  }
};
app.use(express.static('./dist/angular_frontend'));
 
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname,'/dist/angular_frontend/index.html'));
});
 
app.use(forceSSL());
 
app.listen(process.env.PORT || 8080);