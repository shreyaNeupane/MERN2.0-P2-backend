import authmiddleware, { Role } from '../middleware/authmiddleware';
import categoryController from '../controllers/categoryController';
import express , {Router} from 'express'
const router:Router = express.Router()

router.route("/").post(authmiddleware.isAuthenticated,authmiddleware.restrictTo(Role.Admin),categoryController.addCategory)
.get(categoryController.getCategories)

router
  .route("/:id")
  .delete(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Admin),
    categoryController.deleteCategory
  )
  .patch(
    authmiddleware.isAuthenticated,
    authmiddleware.restrictTo(Role.Admin),
    categoryController.updateCategory
  );

  export default router


