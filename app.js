const express = require("express");
const app = express();
const mysql = require("mysql2");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webdev',
        port: '3306',
    }
);

connection.connect((err) => {
    if (err) {
        return console.log(err.message)
    } else {
        return console.log(`Connection to local MySQL DB.`)
    };
});

app.get('/', (req, res) => {
    const burgersSQL = ` SELECT id, b_name, price FROM web_dev_burgers; `;

    connection.query(burgersSQL, (err, result) => {
        if (err) throw err;
        res.render("menu", { burgerlist: result });
    });

});

app.get('/filter', (req, res) => {
    const filter = req.query.sort;
    let burgersSQL = `SELECT id, b_name, price 
                    FROM web_dev_burgers ORDER BY ${filter};`;

    connection.query(burgersSQL, (err, result) => {
        if (err) throw err;
        res.render('menu', { burgerlist: result });
    })
});

app.get('/admin/add', (req, res) => {

    res.render("add");

});

app.post('/admin/add', (req, res) => {
    const burgerN = req.body.burgername; //get data from <input type="text" name="burgername">
    const descriptB = req.body.descript;
    const ingredsB = req.body.ingreds;
    const priceB = req.body.burgerprice;
    const sqlQuery = `INSERT into web_dev_burgers 
             (b_name, description, ingredients, price, img) 
              VALUES 
             ("${burgerN}", "${descriptB}","${ingredsB}","${priceB}","default.jpg")`;

    connection.query(sqlQuery, (err, result)=>{
        if(err) throw err;
        res.render("add");
    });
});

app.listen(3000, () => {
    console.log('Server is listening on localhost:3000');
});
