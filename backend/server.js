import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes
from "./src/routes/profileRoutes.js";
import matchRoutes
from "./src/routes/matchRoutes.js";
import chatRoutes
from "./src/routes/chatRoutes.js";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./src/socket.js";
// import Chat from "./models/Chat.js";

dotenv.config();
connectDB();

const app = express();
const server=http.createServer(app);
app.use(cors({ origin: '*' })); // tighten later
app.use(express.json());
app.use(
   "/api/profile",
   profileRoutes
);
app.use(
"/api/chat",
chatRoutes
);

app.use('/api/auth', authRoutes);
app.use("/api/matches", matchRoutes);

app.get('/', (_, res) => res.send('API running 🚀'));

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server on port ${PORT}`));
const io=new Server(server,{

   cors:{
      origin:"http://localhost:8080",
      methods:["GET","POST"]
   }

});
socketHandler(io);
// io.on("connection",(socket)=>{

//    console.log("Connected",socket.id);

// });
server.listen(PORT,()=>{

console.log("Server running");

});

