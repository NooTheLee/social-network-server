// @ts-ignore
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// @ts-ignore
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// Middle
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFound from "./middleware/not-found.js";

import auth from "./routes/auth.js";
import post from "./routes/post.js";
import message from "./routes/message.js";
import weather from "./routes/weather.js";
import requireSignIn from "./middleware/authentication.js";
import * as http from "http";
import {Server} from "socket.io";

const app = express();
// @ts-ignore
const server = http.createServer(app);
//const io = new Server(server);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH"],
        allowedHeaders: ["Content-type"],
    },
});

if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    app.use(morgan("dev"));
}

// @ts-ignore
app.use(express.json({limit: "5mb"}));
// @ts-ignore
app.use(express.urlencoded({extended: true}));
// @ts-ignore
app.use(
    cors({
        origin: "*",
    })
);

// @ts-ignore
app.use("/api/auth", auth);
// @ts-ignore
app.use("/api/post", requireSignIn, post);
// @ts-ignore
app.use("/api/message", requireSignIn, message);

app.use("/api/weather", requireSignIn, weather);

// @ts-ignore
app.use("/", (req, res) => {
    res.send("Welcome to my api!");
});

// io.on("connect", (socket) => {
//     socket.on("send-message", (message) => {
//         socket.broadcast.emit("receive-message", message);
//     });
// });

io.on("connect", (socket) => {
    socket.on("new-post", (newPost) => {
        console.log("new-post", newPost);
        socket.broadcast.emit("new-post", newPost);
    });
    socket.on("new-comment", (newComment) => {
        //console.log("new-post", newPost);
        socket.broadcast.emit("new-comment", newComment);
    });
    socket.on("new-message", (newMessage) => {
        socket.broadcast.emit("new-message", newMessage);
    });
});

const port = process.env.PORT || 8000;

// @ts-ignore
app.use(notFound);
// @ts-ignore
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await mongoose
            .connect(process.env.URL_2)
            .then(() => console.log("MongoDb connected"));

        server.listen(port, () => {
            console.log("Server is running on port", port);
        });
    } catch (error) {
        console.log(error);
    }
};

start();

// URL = mongodb://socialmedia:Anh123456@socialmedia-shard-00-00.ivl6h.mongodb.net:27017,socialmedia-shard-00-01.ivl6h.mongodb.net:27017,socialmedia-shard-00-02.ivl6h.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-vxl7um-shard-0&authSource=admin&retryWrites=true&w=majority
// URL_2 = mongodb+srv://socialmedia:Anh123456@socialmedia.ivl6h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// PORT = 8000
// JWT = a81324hiwdf@!sdkksndc2398423jfdsfwe
// JWT_LIFETIME = '1d'

// CLIENT_URL_0= https://frost-social-4f5kdlt7u-noothelee.vercel.app
