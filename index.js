const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT || 3021;

const dbName = 'myDatabase';

const connectDB = async () => {
    try {
        const uri = `mongodb+srv://singh2335:fOGpimLzH948CUPX@cluster0.i2oqazy.mongodb.net/database`;
        await mongoose.connect(uri, {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Connect to MongoDB
connectDB();

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });

        if (!existingUser) {
            const registrationData = new Registration({ name, email, password });
            await registrationData.save();
            res.redirect("/success");
        } else {
            res.redirect("/exist");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + '/success.html');
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + '/error.html');
});

app.get("/exist", (req, res) => {
    res.sendFile(__dirname + '/exist.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});