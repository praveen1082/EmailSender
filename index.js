const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));
app.get('/sendemail', function (req, res) {
    res.sendFile(path.join(__dirname, "public/Form.html"));
})

app.post('/sendemail', urlencodedParser, function(req, res) {

    var response = {
        name: req.body.persons_name,
        email: req.body.persons_email,
        subject: req.body.persons_subject,
        message: req.body.persons_message
    };

    var datajson = JSON.stringify(response);
    console.log(datajson);

    fs.writeFileSync('./data.json', datajson);
    

    res.writeHead(301, { Location: '/sendemail' });
    res.end();
    //res.end(JSON.stringify(response));
});
var parsed = JSON.parse(fs.readFileSync('./data.json'), 'utf-8');
    console.log(parsed.email);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: 'Email',
            pass: 'Pass'
        }
    });

    var mailOptions = {
        from: 'Email',
        to: parsed.email,
        subject: parsed.subject,
        text: parsed.message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email Sent: ' + info.response)
        }
    });
console.log(path.join(__dirname + "/" + "Form.html"));
app.listen(8088, function () { console.log("Port 8088") });