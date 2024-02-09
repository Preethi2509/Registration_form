const express = require("express")   //express is web application framework for Node.js
const mongoose = require("mongoose")    //to interact with MongoDB 
const bodyParser = require("body-parser")    //for readability between server and client
const dotenv = require("dotenv")     //to hide the username and password of MongoDB


//creating instance for express
const app = express();

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Internship2a')    //Database is database name
var db = mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open', ()=> console.log("Connected to the Database"))



const User = require('./user'); // Assuming you have a user schema/model defined

app.post("/sign_up", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("User already exists"); // Display a message that user already exists

            //alert("User already exists")
        }

        // If user doesn't exist, create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();
        console.log("Record Inserted Successfully");
        return res.redirect('home.html');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/sign_in", async (req, res) => {
    try {
        const { name, password } = req.body;
        
        // Check if user with the provided email and password exists
        const existingUser = await User.findOne({ name, password });
        if (!existingUser) {
            return res.send("User doesn't exist"); // Display a message that user doesn't exist

            //alert("User doesn't exists")
        }
        
        // Redirect to home page or perform any other action if user exists
        return res.redirect('home.html');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/",(req,res) => {
    // res.send("Server Connection is successful")
    res.set({
        "Allow-access-Allow-Origin":'*'     //since we are using local host
    })
    return res.redirect('registration.html')
} ).listen(3000);

console.log("Listening on port 3000")



