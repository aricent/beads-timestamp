var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
var CONFIGURATION = require("../config.json");
var PASSWORD = require("./password.js");

// open the database
const db = new sqlite3.Database(CONFIGURATION.connectionURL, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Found DB at :', CONFIGURATION.connectionURL);
  db.run(`DELETE FROM activeusers`);
  console.log('Found Default Users: ADMIN');
});

router.post('/login', function(req, res, next) {
  db.serialize(function() { 
    let query = "SELECT * FROM `users` WHERE EMAIL='" + req.body.email + "' AND PASSWORD='" + PASSWORD.saltHashPassword(req.body.password) + "' ORDER BY ID DESC LIMIT 1";
    db.all(query, (err, row) => {
      if (err) {
        console.error(err.message);
        res.send({"status" : "failure"});
        return;
      }
      let data = row;
      //data.push(row);
      if(data.length > 0) {
        req.session.user = req.body.email;
        req.session.admin = true;
        res.send({"status" : "success"});
        //Make an entry to active users list -
      } else {
        res.send({"status" : "failure"});
      }
    });
  });
});

router.get('/logout', function(req, res, next) {
  console.log("Logout");	
  req.session.destroy();
  res.redirect("/tsapp");
});

router.post('/logout', function(req, res, next) {
  db.serialize(function() {  
    db.all("DELETE FROM activeusers where EMAIL='" + req.session.user + "'", (err, updateActiveUser) => {
      req.session.destroy();
      res.send({"status" : "success"});
    }); 
  });  
});

module.exports = router;
