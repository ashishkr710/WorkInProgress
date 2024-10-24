// routes/userRoutes.ts
import { Router } from 'express';
import { getAgencies, addUser, loginUser, userDetails } from '../controller/userController';
import {validateUser} from '../middleware/validateUser'
import { upload } from '../middleware/upload';
import { authorizeUser } from '../middleware/authorizeUser';
import { acceptJobSeeker,getMessages, sendMessage } from '../controller/userController';

const router = Router();

router.get('/agencies', getAgencies);
router.post('/signup', upload.fields([{name:"profileImg"},{name:"resume"}]), validateUser,addUser);
router.get('/userDetails/:userId',authorizeUser, userDetails)
router.post('/login',loginUser)
router.post('/accept-job-seeker', acceptJobSeeker);
router.post('/sendMessage', sendMessage);
router.get('/getMessages/:chatRoomId', getMessages);    

export default router;
