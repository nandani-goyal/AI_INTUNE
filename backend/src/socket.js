import Chat from "./models/Chat.js";
export default function socketHandler(io){

io.on("connection",(socket)=>{

console.log("User Connected");

socket.on("join-chat",(chatId)=>{

socket.join(chatId);
socket.chatId = chatId;

console.log(socket.id,"Joined",chatId);

});
socket.on("send-message", async (data) => {

    try {

        const { chatId, sender, text } = data;

        const chat = await Chat.findById(chatId);

        if (!chat) return;

        chat.messages.push({
    sender,
    text
});

await chat.save();

await chat.populate(
    "messages.sender",
    "_id anonymousId"
);

const lastMessage =
chat.messages[chat.messages.length - 1];

io.to(chatId).emit(
    "receive-message",
    lastMessage
);

    } catch (err) {

        console.log(err);

    }

});

socket.on("disconnect",()=>{

console.log("Disconnected");

});

});

}