import { Router } from 'express';
import {router as authRouter} from './auth.js'

export const router = Router()

router.use('/auth', authRouter)
