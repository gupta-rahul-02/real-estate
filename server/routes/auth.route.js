import express from 'express'
import { google, signIn, signnUp , signOut} from '../controller/auth.controller.js'

const router = express.Router()

router.post('/signup',signnUp)
router.post('/signin',signIn)
router.post('/google',google)
router.get('/signout',signOut)
export default router