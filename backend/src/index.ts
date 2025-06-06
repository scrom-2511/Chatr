import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/db";
import { userRouter } from "./routes/userRouter";
import { messageRouter } from "./routes/messageRouter";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import groupMessageRouter from "./routes/groupMessageRouter";
import groupRouter from "./routes/groupRouter";
import commonRouter from "./routes/commonRouter";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
connectToDatabase();

app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/group", groupRouter);
app.use("/groupMessage", groupMessageRouter);
app.use("/common", commonRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();
const onlineGroups = new Map();

io.on("connection", (socket) => {
  socket.on("onlineUsers", (data) => {
    onlineUsers.set(data.userData.userId, socket.id);
    console.log(onlineUsers);

    const onlineUsersArray = Array.from(onlineUsers.keys());
    io.emit("onlineUsers", onlineUsersArray);
  });

  socket.on("message", (data) => {
    console.log(data);
    const recieverSocketId = onlineUsers.get(data.recieverId);
    if (!recieverSocketId) {
      console.log("no reciever socket id found");
    }
    io.to(recieverSocketId).emit("messageNew", data);
  });

  socket.on("joinGroup", (groupId) => {
    if (!onlineGroups.has(groupId)) {
      onlineGroups.set(groupId, new Set());
    }
    onlineGroups.get(groupId).add(socket.id);

    io.emit("onlineGroups", Array.from(onlineGroups.keys()));
  });

  socket.on("newGroupMessage", (data) => {
    console.log(data);
    const recievers = onlineGroups.get(data.groupId);
    if (!recievers) {
      console.log("no reciever socket id found");
    } else {
      recievers.forEach((reciever: string) => {
        io.to(reciever).emit("newGroupMessage", data);
      });
    }
  });

  // socket.on("newGroupMessage", (data) => {
  //   console.log(data);
  //   const { groupId } = data;
  //   io.to(groupId).emit("newGroupMessage", data);
  // });


  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    onlineGroups.delete(socket.id);

    const onlineUsersArray = Array.from(onlineUsers.keys());
    io.emit("onlineUsers", onlineUsersArray);
  });
});

httpServer.listen(3000);
