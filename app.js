require('dotenv').config();
const checkInternetConnected = require('check-internet-connected');
const fs = require('fs');

const config = {
    timeout: 1000,
    retries: 1,         
    domain: process.env.DOMAIN
}

const delay = process.env.TIMEOUT;

console.log(`Check internet connected ${process.env.DOMAIN}. Timeout: ${process.env.TIMEOUT}`);

let connected = true;
let oldDate = new Date();

let timerId = setTimeout(function request() {
    const nowDate = new Date();
    checkInternetConnected(config)
        .then(() => {
            const deltaDate = (nowDate -  oldDate) / 1000;
            console.log("Internet available", deltaDate);  
            if (!connected)
                fs.appendFileSync('log.txt', `Connected: ${nowDate.toISOString()}, Downtime: ${deltaDate} second\n`);
            connected = true;
            oldDate = nowDate;
        }).catch((error) => {
            const timeDisconect = (nowDate - oldDate) / 1000;
            console.log("Disconnect", timeDisconect);
            if (connected)
                fs.appendFileSync('log.txt', `Disconnect: ${nowDate.toISOString()} - `);
            connected = false;
        });
    timerId = setTimeout(request, delay);
}, delay);

