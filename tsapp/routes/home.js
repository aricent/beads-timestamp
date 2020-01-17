var express = require('express');
var router = express.Router();
const moment = require('moment');
const formidable = require('formidable');
const formidableMiddleware = require('express-formidable');
const csv = require('csv-parser')
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const results = [];
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var supportedFileTypes = ["zip"];
var CONFIGURATION = require("../config.json");

/*********************************************************/
var Web3 = require('web3');
var web3 = new Web3('http://13.251.169.133/ether');

const abi=[ { "constant": false, "inputs": [ { "name": "x", "type": "string" } ], "name": "set", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "get", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

const contract_Address="0x304A9cE09507D9a397842cf0EBDB8Ee6C99F2DB6";
const contract = new web3.eth.Contract(abi, contract_Address);
const fromAddress = "0x210B0d1c071CE9E59f408972dBcC4C98D9945381";

/*********************************************************/

const db = new sqlite3.Database(CONFIGURATION.connectionURL, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Found DB at :', CONFIGURATION.connectionURL);
});
 
router.get('/', function(req, res, next) {
  res.render('home', { title: 'TsApp HOME', user: req.session.user });
});

router.get('/files', function(req, res, next) {
  db.serialize(async function() {
    //db.all("SELECT * FROM imported", function(err, data) {
    db.all("SELECT * FROM INDEXDB", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send(data);	    
    });
  });
});

router.get('/files/:id', function(req, res, next) {
  db.serialize(async function() {
    //db.all("SELECT * FROM imported", function(err, data) {
    db.all("SELECT * FROM INDEXDB WHERE ID = " + req.params.id, function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send(data);	    
    });
  });
});

router.get('/postx', async function(req, res, next) {
  res.render('postx', { title: 'TsApp POST TX', user: req.session.user });
});

router.get('/details', async function(req, res, next) {
  res.render('details', { title: 'TsApp DETAILS', user: req.session.user });
});

router.get('/verify', async function(req, res, next) {
  res.render('verify', { title: 'TsApp VERIFY', user: req.session.user });
});

router.get('/txlist', async function(req, res, next) {
  db.serialize(async function() {
    db.all("SELECT * FROM MERKLEDB ORDER BY ID DESC", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send({ "data": data });
    });
  });
});

router.get('/txlist/:id', async function(req, res, next) {
  db.serialize(async function() {
    db.all("SELECT ROOT_TREE, ROOT_HASH,TRANSACTIONS  FROM COMMITDB WHERE ROOT_HASH='" + req.params.id + "' ORDER BY ID DESC LIMIT 1", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send({ "data": data });
    });
  });
});

router.get('/txhash/:id', function(req, res, next) {
  db.serialize(async function() {
    db.all("SELECT * FROM MERKLEDB WHERE PUBLIC_TXID = '" + req.params.id + "' ORDER BY ID DESC LIMIT 1", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send({ "data": data });
    });
  });
});

router.get('/filename/:id', function(req, res, next) {
  db.serialize(async function() {
    db.all("SELECT * FROM INDEXDB WHERE FILE_NAME LIKE '%" + req.params.id + "%' ORDER BY ID DESC", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send({ "data": data });
    });
  });
});


router.get('/passbook', async function(req, res, next) {
  db.serialize(async function() {
    db.all("SELECT ROOT_TREE, ROOT_HASH,TRANSACTIONS, PUBLIC_TXID FROM COMMITDB ORDER BY ID DESC", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      let finalJSONToCommit = {};
      for(let eachData in data) {	     
        let txid = data[eachData]["PUBLIC_TXID"];	       
        finalJSONToCommit[txid] = {};
        finalJSONToCommit[txid]["root"] = data[eachData]["ROOT_HASH"];
        finalJSONToCommit[txid]["transactions"] = data[eachData]["TRANSACTIONS"].split(",");
        finalJSONToCommit[txid]["proof_obj"] = data[eachData]["ROOT_TREE"];
      }	      
      let filename = "./passbook/tsapp-passbook-" + Math.floor(Date.now() / 1000);	     
      fs.writeFile(filename, JSON.stringify(finalJSONToCommit), function(err) {
        if (err) {
           console.log(err);
        }
        res.download(filename);
      });      	    
    });
  });
});


router.get('/mroot', async function(req, res, next) {
  //let readObject = fs.readFileSync('compiled.json', 'utf-8');
  //readObject = JSON.parse(readObject);
  db.serialize(async function() {
    db.all("SELECT * FROM INDEXDB ORDER BY ID DESC LIMIT 1", function(err, data) {
      if(err) {
        console.error(err.message);
        res.send([]);	    
      }
      res.send({ "data": data });
    });
  });
});

router.post('/set', async function(req, res, next) {
  console.log(req.body["ROOT_HASH"]);
  console.log(JSON.parse(req.body["ROOT_TREE"]));	 
  console.log(req.body["TXID"]);
  db.serialize(async function() {
    db.all("SELECT MAX(ID) FROM COMMITDB", (err, counts) => {
      if(err) {
        console.log(err.message);
        res.send({"status" : "failure"});	      
        return;
      }
      counts = counts[0]['MAX(ID)'];
      if(counts == null)
        counts = 1;
      else
        counts = parseInt(counts) + 1;
      db.all("INSERT INTO COMMITDB VALUES(" + counts + ",'" + req.body["ROOT_HASH"] + "','" + req.body["ROOT_TREE"] + "','" + req.body["TXID"] + "','" + Math.floor(Date.now() / 1000) + "','" + req.body["TRANSACTIONS"] + "')", function(err, data) {
        if(err) {
          console.error(err.message);
          res.send([]);	    
        }
        db.all("SELECT MAX(ID) FROM MERKLEDB", (err, countsMerkle) => {
          if(err) {
            console.log(err.message);
            res.send({"status" : "failure"});	      
            return;
         }
         countsMerkle = countsMerkle[0]['MAX(ID)'];
         if(countsMerkle == null)
           countsMerkle = 1;
         else
           countsMerkle = parseInt(countsMerkle) + 1;
         db.all("INSERT INTO MERKLEDB VALUES(" + countsMerkle + ",'" + req.body["TXID"] + "','" + req.body["ROOT_HASH"] +"','" + 0 + "')", function(err, dataMerkle){
           if(err) {
             console.error(err.message);
             res.send([]);	    
           }
           db.all("SELECT MAX(ID) FROM MERKLETOGGLE", (err, countsMerkleToggle) => {
             if(err) {
               console.log(err.message);
               res.send({"status" : "failure"});	      
               return;
             }
             countsMerkleToggle = countsMerkleToggle[0]['MAX(ID)'];
             if(countsMerkleToggle == null)
               countsMerkleToggle = 1;
             else
               countsMerkleToggle = parseInt(countsMerkleToggle) + 1;
             db.all("SELECT MAX(ID) FROM INDEXDB", (err, countsLastIndex) => {
               if(err) {
                 console.log(err.message);
                 res.send({"status" : "failure"});
                 return;
               }             		   
               countsLastIndex = countsLastIndex[0]['MAX(ID)'];		   
               countsLastIndex = parseInt(countsLastIndex) + 1;               		      
               db.all("INSERT INTO MERKLETOGGLE VALUES(" + countsMerkleToggle + ",'" + countsLastIndex + "')", function(err, dataMerkle){
                 if(err) {
                   console.error(err.message);
                   res.send([]);	    
                 }
                 res.send({"status": "success"});
                });
              });
            });
          });
        });
      });
    });
  });
});


router.post('/addtoblockchain', async function(req, res, next) {
contract.methods.set(req.body["hash_obj"]).send({from: fromAddress})
  .on('transactionHash', function(hash){
    console.log('*************************');
    console.log(hash);
    console.log('*************************');
  })
  .on('receipt', function(receipt){
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    console.log(receipt);
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  })
  .on('confirmation', function(confirmationNumber, receipt){
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(confirmationNumber, receipt);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    res.send(receipt);	  
  })
  .on('error', console.error);
});

router.post('/upload', async function(req, res, next) {
  try {
    var meta = '';	   
    var fileNameWithoutExtensions = '';   
    var timestamp = '';
    console.log("Uploading New File with Path: " + __dirname);
    var form = new formidable.IncomingForm();
    form.parse(req)
      .on('field', (name, field) => {
        /* Fields come here */	      
        //meta = field;	       
	if(name == "file-upload-meta") {
          meta = field;
        }		  
      })
      .on('fileBegin', (name, file) => {
          if((file.name == "") || (file.name.length ==0)) {
            file.name = "text-data-commited";
          } else {		   
            file.name = file.name + "-" + Math.floor(Date.now() / 1000);	       
            file.path = __dirname + '/../uploads/' + file.name;
          }		        
      })
      .on('file', async function(name, file) {
            console.log('Uploaded File: ', file.name)
            //CHECK FILE TYPE
            let fileType = file.name;
            //fileType = fileType.split(".")[1];
            fileType = fileType.split('.').pop()
            let spawn = require("child_process").spawn;
	    console.log(["./tsapp_encode.py", file.name, fileNameWithoutExtensions]);
            let process = spawn('python',["./tsapp_encode.py", meta, file.name]);
            process.stdout.on('data', async function(data) {
	      let readObject = fs.readFileSync('compiled.json', 'utf-8');
              readObject = JSON.parse(readObject);
              console.log(data.toString());
	      data = readObject;
              if(data["status"] == "success") {
                db.serialize(async function() {
                  db.run("INSERT INTO `imported` values(NULL, '" + Math.floor(new Date().getTime() / 1000) + "', '" + file.name + "', '" + __dirname + "','" + JSON.stringify(readObject) + "')");
                });                
                //res.send({"data": JSON.stringify(readObject)});
                //res.render('postx', { title: 'TsApp POST TX', user: req.session.user });
		res.redirect('postx');
                
              } else {
                res.render('home', { title: 'TsApp HOME', user: req.session.user });
              }
          });
      });
    } catch(e) {
      console.log(e);
      res.render('404', { title: 'TsApp ERROR', dbname: req.params.dbname, user: req.session.user });
      return;
    }
});


router.post('/verify', async function(req, res, next) {
  try {
    var meta = '';	   
    var fileNameWithoutExtensions = '';   
    var timestamp = '';
    var txID = '';	   
    console.log("Uploading New File with Path To Verify: " + __dirname);
    var form = new formidable.IncomingForm();
    form.parse(req)
      .on('field', (name, field) => {
        //console.log("************************");	      
        //console.log(name, field);	       
        //console.log("************************");	      
        /* Fields come here */
        if(name == "txid") {	       
          txID = field;	    
        /*} else if(name == "meta-verify") {
          meta = field;
        }*/ //Using user given meta data, so commented the above lines
        } else if(name == "file-verfiy-meta") {
          console.log("FILE META:" + meta);		
          meta = field;
        }		
      })
      .on('fileBegin', (name, file) => {
          if((file.name == "") || (file.name.length ==0)) {
            file.name = "text-data-commited";
          } else {		   
            file.name = file.name + "-" + Math.floor(Date.now() / 1000);	       
            file.path = __dirname + '/../verify/' + file.name
          }		      
      })
      .on('file', async function(name, file) {
            console.log('Uploaded File: ', file.name)
            //CHECK FILE TYPE
            let fileType = file.name;
            //fileType = fileType.split(".")[1];
            fileType = fileType.split('.').pop()
            /*if(supportedFileTypes.indexOf(fileType) < 0) {
              res.render('import', { title: 'TsAPP IMPORT', body: [], status: "Incorrect File Type",  user: req.session.user}); 
              return; 
            }*/
            let spawn = require("child_process").spawn;
	    console.log(["./tsapp_decode.py", meta, file.name, txID]);
            let process = spawn('python',["./tsapp_decode.py", meta, file.name, txID]);
            process.stdout.on('data', async function(data) {
              console.log("####", data.toString());		    
	      data = JSON.parse(data);
              console.log(data["status"]);
              if(data["status"] == "success") {		       
                res.send({"status": "success", "msg": "File " + file.name.split("-")[0] + " verified with Tx ID " + txID, "link": "https://ropsten.etherscan.io/tx/" + txID});
              } else {
                res.send({"status": "failure", "msg": "File " + file.name.split("-")[0] + " could not be verified."});
              }
          });
      });
    } catch(e) {
      console.log(e);
      res.send({"data": "failure"});
      return;
    }
});


module.exports = router;
