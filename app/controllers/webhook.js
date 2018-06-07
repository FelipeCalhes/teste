var express = require("express"),
    router = express.Router(),
    config = require("../../config/config"),
    fb = require("../models/work-chat"),
    member = require("../models/member"),
    mysql = require("mysql");

module.exports = function (app) {
  app.use("/", router);
};

// Workplace token verification
router.get("/webhook/", function (req, res) {
  if (req.query["hub.verify_token"] === config.verify_token) {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong token");
});

router.post("/webhook/", function (req, res) {
  res.sendStatus(200);
  var con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  
  let query = "SELECT QUEST_TXT FROM WORKPLACE.QUESTIONS WHERE QUESTION = 1 AND LANG = \"PT_br\"";
  let buttons = [
    {
      "type": "postback",
      "title": "Help",
      "payload": "Help_4"
    }
  ]

  con.query( query, function (err, result, fields) {
    if (err) {
      console.log(err);
      throw err;
    }
    let text = result[0].QUEST_TXT;
    console.log(text);
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i];
      let sender = fb.createSenderFromId(event.sender.id);
      let name = "Teste"; 
      //console.log(member.getDefaultSingleMember(event.sender.id).name);
      // Handle receipt of a message
      if (event.message && event.message.text) {
        fb.sendSenderAction(sender, fb.createSenderActionMarkSeen());
        //fb.sendTextMessage(sender, "teste" + text.replace("&", name ).substring(0, 200));
        fb.sendButtonsTemplate(sender, text.replace("&", name ).substring(0, 200), buttons);
      }
    }
  });

  

  
    

    

  /*  // Handle receipt of a postback
    if (event.postback) {
      let text = JSON.stringify(event.postback);
      fb.sendTextMessage(sender, "Postback received: " + text.substring(0, 200));
      continue;
    }

  }
  res.sendStatus(200);*/

});
