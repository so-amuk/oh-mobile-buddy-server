const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const model = require('./model');
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Loading Firebase Package
var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "oh-mobile-buddy-bc7a9-firebase-adminsdk-2mtsn-ab256f7bda.json",
    databaseURL: "https://oh-mobile-buddy-bc7a9.firebaseio.com"
  });  //by adding your credentials, you get authorized to read and write from the database
var db = firebase.database();
var ref = db.ref("users");


const headers = {
    'Content-Type': 'application/json'
};

/**
* Reading Value from
* Firebase Data Object
*/
app.get("/getusers", (req,res) => {
    ref.once("value", function(snapshot) {
        var data = snapshot.val();   //Data is in JSON format.
        res.status(200).send(data);
    });
});



app.post("/notification", (req, res) => {
    ref.once("value", function (snapshot) {
        var data = snapshot.val();   //Data is in JSON format.
        var dbObject = {
            email: req.body.UserEmail,
            token: data[Buffer.from(req.body.UserEmail).toString('base64')],
            meetingData: model.constructMeetingData(req)
        }; 
        var notificationref = db.ref("notifications" + "/" + Buffer.from(req.body.UserEmail).toString('base64'));
        console.log('notification started');
        axios.post('https://exp.host/--/api/v2/push/send',
            {
                "to": data[Buffer.from(req.body.UserEmail).toString('base64')],
                "title": "onemore",
                "body": JSON.stringify(dbObject)
            },
            { headers: headers }
        )
            .then((res) => {
                console.log('notification ended');
                notificationref.push({ meetingData: dbObject.meetingData });
            })
            .catch((error) => {
                console.log('notification error');
                console.error(error);
            });
        res.status(200).send(dbObject);
    });
});


module.exports = app;