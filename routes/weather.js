import express from "express";
import axios from "axios";

const router = express.Router();
router.route("/").get((req, res) => {
    res.send("API weather!");
});

router.route("/:city").get(async (req, res) => {
    try {
        const {city} = req.params;
        const {data} = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cc5c79abcbb099519d0e85e8ed481946`
        );
        return res.status(200).json({data});
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg: "Something went wrong. Try again!"});
    }
});

export default router;
