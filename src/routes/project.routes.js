import { Router } from "express"
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js"
import { UserRolesEnum } from "../constants.js"

const router = Router()

router.use(verifyJWT)

import {
  createProject,
  getProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controllers.js"

router
  .route("/")
  .get(getProjects)
  .post(
    verifyRole([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN]),
    createProject
  )
router
  .route("/:projectId")
  .get(getProject)
  .patch(
    verifyRole([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN]),
    updateProject
  )
  .delete(
    verifyRole([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN]),
    deleteProject
  )

export default router
