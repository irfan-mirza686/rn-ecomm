import express from 'express'
import { testController } from '../controllers/testController.js';

//Router object 
const router = express.Router();

//routes
router.get('/test',testController)

// export 
export default router;