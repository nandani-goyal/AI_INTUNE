import Chat from "../models/Chat.js";


// Create chat or return existing chat
export const createOrGetChat = async (req, res) => {

  try {

    const currentUser = req.user._id;

    const { matchedUserId } = req.body;

    let chat = await Chat.findOne({

      participants: {
        $all: [currentUser, matchedUserId]
      }

    });

    if (chat) {

      return res.json(chat);

    }

    chat = await Chat.create({

      participants: [
        currentUser,
        matchedUserId
      ],

      messages: []

    });

    res.status(201).json(chat);

  }

  catch (err) {

    res.status(500).json({
      msg: err.message
    });

  }

};

export const getMessages = async (req,res)=>{

   try{

      const chat = await Chat.findById(
         req.params.chatId
      )
      .populate(
         "messages.sender",
         "anonymousId"
      );

      if(!chat){

         return res.status(404).json({
            msg:"Chat not found"
         });

      }

      res.json(chat.messages);

   }

   catch(err){

      res.status(500).json({
         msg:err.message
      });

   }

}

export const sendMessage = async (req,res)=>{

   try{

      const {text}=req.body;

      const chat=await Chat.findById(
         req.params.chatId
      );

      if(!chat){

         return res.status(404).json({
            msg:"Chat not found"
         });

      }

      chat.messages.push({

         sender:req.user._id,

         text

      });

      await chat.save();

      res.json(chat);

   }

   catch(err){

      res.status(500).json({

         msg:err.message

      });

   }

}
