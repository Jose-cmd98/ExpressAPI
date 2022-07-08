// imports neededs
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express(); // create express app
const port = 3000

//config express to understand json
app.use(express.json());
app.use(cors('*'));

//example route
app.get('/', (req, res) => {
    res.status(200).json({msg: "Welcome to the API"});
})


//user routes
const userRoutes = require('./routes/userRoutes');

//register user
app.use('/auth/register', userRoutes);

//login user
const login = require('./routes/loginRoutes');
app.use('/auth/login', login);







// Credentials of the database
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;


// Connect to MongoDB
mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@authjwt.n3icehj.mongodb.net/?retryWrites=true&w=majority`
)
.then(()=>{
    console.log('Connected to MongoDB');
    app.listen(port , console.log('Server has started on port ' + port));

})
.catch(err => console.log(err));
