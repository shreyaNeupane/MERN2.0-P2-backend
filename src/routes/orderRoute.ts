import express,{Router} from 'express'
import authmiddleware from '../middleware/authmiddleware'
import errorHandler from '../services/catchAsyncError'
import orderController from '../controllers/orderController'
const router:Router = express.Router()


  


router.route('/').post(authmiddleware.isAuthenticated,errorHandler(orderController.createOrder))
router.route('/verify').post(authmiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction))
export default router