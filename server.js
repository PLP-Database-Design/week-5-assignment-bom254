const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if(err){
        return console.log('Error connecting to mysq', err);
    }

    console.log('Connected successfully', db.threadId);
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.get('/', (req, res) => {
    res.send('Welcome to the home page');
    });
    // Display message to the browser
    app.get('/getPatients', (req, res) =>{
        const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

        // Query from the database
        db.query(getPatients, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).send('Failed to get patients');
            }else{
               // Display the results to the browser
                 res.render('getPatients', {results: results})
                }
        });
    });

    app.get('/providers', (req,res) =>{
        const providers = 'SELECT first_name, last_name, provider_specialty FROM providers';

        // Query from the database
        db.query(providers, (err, results) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Failed to get patients');
            }else{
                // Display results to the browser
                res.render('providers', {results: results})
            }
        })
    })

    app.get('/patients' , (req,res) =>{
        const patients = 'SELECT first_name FROM patients';

        // Query from the database
        db.query(patients, (err, results) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Failed to get patients');
            }else{
                // Display the results to the browser
                res.render('patients', {results: results})
            }
        });
    });
    app.get('/specialty', (req,res) =>{
        const specialty = 'SELECT provider_specialty FROM providers';

        // Query from the database
        db.query(specialty, (err,results) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Failed to get specialty');
            }else{
                // Display the reults to the browser
                res.render('specialty', {results: results})
            }
        });
    });
});



// app.get('/data', (req, res) => {
//     const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

//     db.query(getPatients, (err, results) => {
//         if(err){
//             console.log(err);
//             return res.status(500).send('Failed to get patients');
//         }else{
//             // Display the results to the browser
//             res.render('data', {results: results})
//         }
        
//     });
    
// });


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);

    
});