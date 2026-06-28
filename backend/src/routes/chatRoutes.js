import express from "express";

import {

createOrGetChat,

getMessages,

sendMessage

} from "../controllers/chatController.js";

import {protect} from "../middleware/authMiddleware.js";

const router=express.Router();

router.post(
"/",
protect,
createOrGetChat
);

router.get(
"/:chatId",
protect,
getMessages
);

router.post(
"/:chatId/message",
protect,
sendMessage
);

export default router;