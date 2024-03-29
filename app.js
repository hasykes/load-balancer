const express = require('express');
const request = require('request');

//load env variables
const dotenv = require('dotenv');
dotenv.config();

const publicIP = process.env.PUBLIC_IP
//all services are on same server, different ports
//front end forwarding only
const serverPorts = {
    homebridge: process.env.HOMEBRIDGE_PORT,
    alarm: process.env.ALARM_PORT
}

const handler = (req, res) => {
    // Add an error handler for the proxied request
    if (!req.get('host')) { return null }
    //console.log(req.get('host'))
    const subDomain = req.get('host').split('.')[0] //split FQDN by '.' to find each part of URL
    const qParams = req.originalUrl.split('?')[1]

    const redirectUrl = 'http://' + publicIP + ':' + serverPorts[subDomain] + "?" + qParams //concat localIP:subdomainPort to get redirect
    console.log(redirectUrl)

    res.redirect(redirectUrl);
    //req.pipe(_req).pipe(res);

};

const server = express().get('*', handler).post('*', handler);

server.listen(8099);