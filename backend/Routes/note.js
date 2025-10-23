const express = require("express");
const router = express.Router();
const Note = require("../Models/notes");

router.post("/", async(req,res)=>{
    try{
        const { title,fileUrl,createdAt}= req.body;
        const userId = req.session.user.id;
        // validate user -use session
        if(!userId)return res.status(401).json({message:"Not authenticated"});

        
        const note = await Note.create({
            title,
            fileUrl,
            user:userId, // User_id
            createdAt
        });
        res.status(201).json(note);
    }catch(err){
        res.status(500).json({error:"Failed to save note."});
    }
});

router.get("/", async (req, res) => {

  if (!req.session || !req.session.user.id) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  try {
    const userId = req.session.user.id; 
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});



module.exports=router;