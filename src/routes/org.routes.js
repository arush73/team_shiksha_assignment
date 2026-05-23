import { Router } from "express"
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js"
import { UserRolesEnum } from "../constants.js"

const router = Router()
router.use(verifyJWT)

import {
  createOrg,
  getOrgById,
  getOrgs,
  updateOrg,
  deleteOrg,
  addOrgMember,
} from "../controllers/org.controllers.js"

router
  .route("/")
  .post(verifyRole([UserRolesEnum.SUPER_ADMIN]), createOrg)
  .get(getOrgs)
router
  .route("/:orgId")
  .get(getOrgById)
  .patch(
    verifyRole([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN]),
    updateOrg
  )
  .delete(verifyRole([UserRolesEnum.SUPER_ADMIN]), deleteOrg)

router
  .route("/:orgId/members")
  .post(
    verifyRole([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN]),
    addOrgMember
  )

export default router
