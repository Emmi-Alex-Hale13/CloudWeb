const express = require('express');
const debug = require('debug') ('app');
const path = require('path');
const morgan = require('morgan');
const sql = require('mssql');
const { applyStyles } = require('@popperjs/core');

const app = express ();
const port = process.env.PORT || 3000;

var bodyParser = require("body-parser");
const mssql = require('mssql');
app.use(bodyParser.urlencoded({ extended: false }));

const config = {
    user: 'admin1',
    password: 'P@ssWord1',
    server: 'wagg.database.windows.net',
    database: 'waggdb',
  
    options: {
      encrypt: true
    }
  }
  
 let connection = sql.connect(config).catch((err) => debug(err));


app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res){
    (async function query(){
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM walkers');
        debug(result);
        res.render('index', {
            title: 'Waggly',
            lores: result.recordset
        });
    }())
    
})

app.post('/', function (req, res){
    (async function query(){
        console.log("here");
        OwnerName=req.body.name;
        PetName=req.body.pet;
        DogArea=req.body.area;
        const request = new sql.Request();
        const statement = "INSERT INTO dogs (OwnerName, PetName, DogArea) VALUES (@OwnerName,@PetName,@DogArea);";
        
        const stat = new mssql.PreparedStatement();
        stat.input('OwnerName', mssql.VarChar);
        stat.input('PetName', mssql.VarChar);
        stat.input('DogArea', mssql.VarChar);
        await stat.prepare(statement);
        await stat.execute({OwnerName: OwnerName, PetName: PetName, DogArea: DogArea});
        // const result = await request.query();
        await stat.unprepare();
        
        // debug(result);
        res.redirect('/', {
            title: 'Waggly'
        });
    }())  
})

app.listen(port, function(){
    debug('listening on port 4000');
})
