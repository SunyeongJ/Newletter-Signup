const express = require("express");
const https = require("https");
const app = new express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/4a92f2d53f";

    const options = {
        method: "POST",
        auth: "Mirae:5f7916a3462e921e702c1f5405c2ddab-us5"
    }

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

    app.post("/failure", function(req, res) {
        res.redirect("/");
    })

});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

// API Key 
// 5f7916a3462e921e702c1f5405c2ddab-us5

// List id
// 4a92f2d53f
