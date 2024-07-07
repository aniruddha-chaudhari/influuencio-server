import express, { response } from 'express';
import { getInfo } from '../controllers/infoController.js';

const router = express.Router();

router.post('/user', getInfo);

export default router;