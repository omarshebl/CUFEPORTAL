const path = require("path");
const express = require("express");
const handle_req = require('./handle_req');

const app = express();
const publicPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, '../views');

app.set('view engine', 'hbs');
app.set('views', viewPath);
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use(express.static(publicPath))
app.get('', (req, res) => {
    res.render('index', {
        script_lnk: 'location.js',
        css_lnk: 'location.css' 
    });
})

app.post('/req', async (req, res) => {
    const data = await handle_req(req.body);
    res.json(data);
});

app.get('*', (req, res) => {
    res.render('404'); 
});

app.listen(3000);
