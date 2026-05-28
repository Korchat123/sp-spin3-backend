import { Router } from 'express';
import { register, login } from '../modules/users/userController.js';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
