const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const Notification = require("./models/notificationModel");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");

    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", (chatId) => {
    socket.broadcast.emit("typing", chatId);
  });

  socket.on("stop typing", (chatId) => {
    socket.broadcast.emit("stop typing", chatId);
  });

  socket.on("new message", async (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(async (user) => {
      if (user._id === newMessageReceived.sender._id) return;

      // Create and save a new notification
      const newNotification = new Notification({
        sender: newMessageReceived.sender._id,
        recipient: user._id,
        chat: chat._id,
      });
      await newNotification.save();
      // Emit the 'message received' event to the recipient
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
