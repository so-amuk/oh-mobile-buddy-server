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



// axios.post('https://exp.host/--/api/v2/push/send',
//         {
//             "to": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5]",
//             "title":"onemore",
//             "body": "test"
//         },
//         {headers: headers}
//     )
//     .then((res) => {
//     console.log(`statusCode: ${res.statusCode}`)
//     console.log(res)
//     })
//     .catch((error) => {
//     console.error(error)
//     });





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




app.get("/senddata", (req,res) => {
    axios.post('https://exp.host/--/api/v2/push/send', {headers: headers}, [
        {
            "to": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5]",
            "title":"hello",
            "body": "world"
        }
    ])
    .then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
    })
    .catch((error) => {
    console.error(error)
    });
    res.send("Received POST request!");
});


/**
* Loading Firebase Database and refering 
* to user_data Object from the Database
*/
app.get("/pushusers", (req,res) => {

    /**
    * Setting Data Object Value
    */
    ref.set(
        [
            {"WWWWFqYXRkZXZ2QGdtYWlsLmNvbQ253D25EE": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "},
            {"ZZZZFqYXRkZXZ2QGdtYWlsLmNvbQ253D2WWW": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "},
            {"QQQQFqYXRkZXZ2QGdtYWlsLmNvbQ253D25EE": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "},
            {"AAAAFqYXRkZXZ2QGdtYWlsLmNvbQ253D2WWW": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "}
        ]
        );

    res.status(200).send([
        {"WWWWFqYXRkZXZ2QGdtYWlsLmNvbQ253D25EE": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "},
        {"ZZZZFqYXRkZXZ2QGdtYWlsLmNvbQ253D2WWW": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "},
        {"QQQQFqYXRkZXZ2QGdtYWlsLmNvbQ253D25EE": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "},
        {"AAAAFqYXRkZXZ2QGdtYWlsLmNvbQ253D2WWW": "ExponentPushToken[aIEsAvCszTE7AEw66jXtV5] "}
    ]);    
}
);

app.get('/test', (req,res)=>{
    fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: 'ExponentPushToken[FQp1aQMsoa5oH63DhutEwj]',
        title: 'title',
        body: 'body',
        data: { message: `title-body` },
        sound: "default"
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });



      res.status(200).send({status: "true"});
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
                "title": dbObject.meetingData.subject,
                "body": `Starting at ${dbObject.meetingData.meetingDate} UTC`
            },
            { headers: headers }
        )
            .then((resp) => {
                console.log('notification ended');
                notificationref.push({ meetingData: dbObject.meetingData });
                res.status(200).send({"status": "OK"});
                console.log(resp)
            })
            .catch((error) => {
                console.log('notification error');
                console.error(error)
                res.status(400).send({"status": "bad request"});
            });
       
    });
});


module.exports = app;