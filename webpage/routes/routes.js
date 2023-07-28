const express = require('express')
const router =express.Router()
const Model =require('../models/model');
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')

function isGmailEmail(email) {
    const regex = /@gmail\.com$/i;
    return regex.test(email);
  }
  

router.post('/signup',async(req,res) => {
    const {name,emailid,password}= req.body;
    const existingUser = await Model.findOne({ emailid });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    if (!isGmailEmail(emailid)) {
        return res.status(400).json({ message: 'Invalid email format. Only Gmail addresses are allowed.' });
      }
    
    const hashedPassword =await bcrypt.hash(password,10)
        const data = new Model({
        name,
        password :hashedPassword,
        emailid
    })
    try{
        const savedUser = await data.save();
        res.status(200).json(savedUser)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

router.get('/login',async(req,res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.get('./getOne/:id',async(req,res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.patch('/update/:id',async(req,res) => {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const options = {new:true};
        
        const result = await Model.findByIdAndUpdate(
            id,updatedData,options
        )
        res.send(result)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

router.delete('/delete/:id',async(req,res) => {
    try{
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted`)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})



module.exports =router;