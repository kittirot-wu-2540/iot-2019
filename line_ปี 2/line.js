const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");

const app = express();
const port = process.env.PORT || 9000;
const hostname = "127.0.0.1";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer fcaF4suv/FCXkkMiWL4mJgTvGvf58TS1v6KM9wSNGQeAaQmiCpeZB3E0CG9xhQqBGt+bwwhYOw0YfHnvy/pheC6ZoHSZ5nGYBJQE2jVMDTT9mX6mdu0dYDrpr+P2FJvWbN2UDqjfIyEZdJNY9cwPaAdB04t89/1O/w1cDnyilFU="
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Push
app.get("/webhook", (req, res) => {
  // push block
  let msg = "Hello World!";
  push(msg);
  res.send(msg);
});

// Reply
app.post("/webhook", (req, res) => {
  // reply block
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  let data;
  if (msg.toLowerCase().search("hello") != -1) {
    reply(reply_token, "สวัสดี");

  } else if(msg.toLowerCase().search("request post") != -1){
    request.post({
        headers: {
            'Content-Type': 'application/json',
            'Accpet': 'application/json'
        },
        url: 'https://loraiot.cattelecom.com/portal/iotapi/auth/token',
        body: {
            "username": "lu69x",
            "password": "walailak"
        },
        json: true
    }, function (error, response, body) {
        console.log(body);
        reply(reply_token,body)
    });

  }else if(msg.toLowerCase().search("request get") != -1) {
    request("http://dummyiot2019.herokuapp.com/getgroupx", function(
      error,
      response,
      body
    ) {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("body:", body); // Print the HTML for the Google homepage.
      console.log(msg);

      reply(reply_token, body);
    });
  } else {
    reply(reply_token, msg);
  }
});

function push(msg) {
  let body = JSON.stringify({
    // push body
    to: "U135b92ff9141db0c177d8e816048e8bf",
    messages: [
      {
        type: "text",
        text: msg
      }
    ]
  });
  curl("push", body);
}

function reply(reply_token, msg) {
  let body = JSON.stringify({
    // reply body
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: msg
      }
    ]
  });
  curl("reply", body);
}

function curl(method, body) {
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/" + method,
      headers: HEADERS,
      body: body
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
    }
  );
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
