const cron = require('node-cron');
const shell = require('shelljs');
const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config()

const app = express();
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass
    }
  });

const port = process.env.PORT;

cron.schedule('59 23 * * *', () => {
    console.log("---------------------");
    console.log('running a task every minute');
    // delete the error.log file
    fs.unlink('./error.log', err =>{
        console.log('error log file deleted successfully');
    })
    // backup database
    if (shell.exec('sqlite3 database.sqlite .dump > data_dump.sql').code !== 0) {
        shell.echo('Error: Database backup failed');
        shell.exit(1);
      }
      else{
          console.log('Success, database backup completed');
      }
    });
    // send email every monday of the week
    cron.schedule("* * * * Monday", ()=>{
        console.log("---------------------");
        console.log("Running Cron Job");
      let mailOptions = {
        from: "abass@enyata.com",
        to: "adamoabasstope@yahoo.com",
        subject: `Awesomeness update ;)`,
        text: `Hi there, I am just trying to let you know that you are awesome `
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email successfully sent!");
        }
      });
    })

app.listen(port, (req, res)=>{
    console.log(`server is now listening on port ${port}`)
})