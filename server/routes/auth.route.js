import express from 'express'
import { signIn, signnUp } from '../controller/auth.controller.js'

const router = express.Router()

router.post('/signup',signnUp)
router.post('/signin',signIn)

export default router