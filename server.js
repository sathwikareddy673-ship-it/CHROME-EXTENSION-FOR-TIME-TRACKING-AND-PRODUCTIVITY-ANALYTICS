const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/timetracker")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const UsageSchema = new mongoose.Schema({
    website: String,
    minutes: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

const Usage = mongoose.model("Usage", UsageSchema);

app.post("/save", async (req, res) => {

    try {

        const usage = new Usage(req.body);

        await usage.save();

        res.json({
            message: "Saved Successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/usage", async (req, res) => {

    try {

        const data = await Usage.find();

        res.json(data);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});