const express = require('express')
const router = express.Router()
const path = require("path");
const memBundle = require('./mybundler/membundle.js');

const routes =
{
    "/":"index.html",

}

module.exports = routes;