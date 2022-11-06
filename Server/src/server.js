const path = require("path")
const express = require("express")

const server = express()
const publicPath = path.join(__dirname, "../public")

server.get("", (req, res) => {
    res.send("Hello World!")
})

server.listen(3000)
