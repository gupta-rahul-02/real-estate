import express from 'express'
import { signnUp } from '../controller/auth.controller.js'

const router = express.Router()

router.post('/signup',signnUp)

export default router