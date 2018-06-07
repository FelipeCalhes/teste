var express = require("express"),
    router = express.Router(),
    config = require("../../config/config"),
    fb = require("../models/work-chat"),
    member = require("../models/member"),
    sql = require("../models/bcdp-sql");

module.exports = function (app) {
  app.use("/", router);
};

function sendQuestion(from, to, question, questionId){
  let buttons = [
    {
      "type": "postback",
      "title": "Help",
      "payload": "Help_" + questionId
    }
  ]
  let sender = fb.createSenderFromId(to);
  let userPromise = member.getDefaultSingleMember(from);
  userPromise.then(function(result){
    let name = result.name;
    // Handle receipt of a message
    if (event.message && event.message.text) {
      fb.sendSenderAction(sender, fb.createSenderActionMarkSeen());
      fb.sendButtonsTemplate(sender, question.replace("&", name ).substring(0, 200), buttons);
    }
  })
}

// Workplace token verification
router.get("/webhook/", function (req, res) {
  if (req.query["hub.verify_token"] === config.verify_token) {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong token");
});

router.post("/webhook/", function (req, res) {
  res.sendStatus(200);
  

  
  let questions = sql.getQuestions();
  
  
  /*let buttons = [
    {
      "type": "postback",
      "title": "Help",
      "payload": "Help_4"
    }
  ]*/

    let text = result[0].QUEST_TXT;
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
      let activeWf = sql.getActiveWf(event.sender.id);
      activeWf.then(function(results){
        if(results[0]){

        }else{
          
        }
      })

      //let sender = fb.createSenderFromId(event.sender.id);
      

      /*let userPromise = member.getDefaultSingleMember(event.sender.id);
      userPromise.then(function(result){
        let name = result.name;
        // Handle receipt of a message
        if (event.message && event.message.text) {
          fb.sendSenderAction(sender, fb.createSenderActionMarkSeen());
          fb.sendButtonsTemplate(sender, text.replace("&", name ).substring(0, 200), buttons);
        }
      })*/
    }

  /*  // Handle receipt of a postback
    if (event.postback) {
      let text = JSON.stringify(event.postback);
      fb.sendTextMessage(sender, "Postback received: " + text.substring(0, 200));
      continue;
    }

  }
  res.sendStatus(200);*/

});
