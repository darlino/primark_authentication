const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();
dotenv.config()



//Importer les routes
const authRoute = require('./routes/authentification')


//connection a la base de donnees
mongoose.connect( 
    process.env.DB_CONNECT,
{ useNewUrlParser: true }

,() => (console.log("connectes a  la base de donnnees")))

//middlewares
app.use(express.json())

// Route middleware 
app.use('/api/user', authRoute)

app.listen(3000, () => console.log("server is mount"))  