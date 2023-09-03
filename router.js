const express = require('express')
const router = express.Router()
const path = require("path");
const memBundle = require('./mybundler/membundle.js');

const routes =
{
    "/":"home/home.html",

}

// Making  the routes
Object.entries(routes).forEach(e=>{
    const [k,v] = e;
    router.get(k,(req,res)=>{
        memBundle.build().then(()=>{
            res.sendFile(path.join(__dirname,"build",v));
        });
    })  
})

module.exports = router;