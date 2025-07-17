import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebars,getMessages ,sendMessage} from '../controller/message.controller.js';
const router = express.Router();

router.get('/users',protectRoute,getUsersForSidebars);
router.get('/:id',protectRoute,getMessages);
router.post('/send-message/:id',protectRoute,sendMessage);

export default router;