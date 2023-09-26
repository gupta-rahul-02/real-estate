import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const signnUp = async(req,res,next) =>{
    const {username, email, password} = req.body
    const hashedPassword = await  bcryptjs.hashSync(password,10)
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(201).json({
            message:'User created successfully'
        })
    } catch (error) {
        next(error)
    }
    

   
}