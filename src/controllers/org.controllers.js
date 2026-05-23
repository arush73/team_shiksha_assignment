import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {
  createOrgSchema,
  getOrgSchema,
  updateOrgSchema,
  deleteOrgSchema,
  addOrgMemberSchema,
} from "../validators/org.validators.js"
import Org from "../models/org.models.js"
import User from "../models/user.models.js"
import { UserRolesEnum } from "../constants.js"

// currently letting you create an org with or without members 
const createOrg = asyncHandler(async (req, res) => {
  const validate = createOrgSchema.safeParse(req.body)
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((mess) => mess.message)
    )

  const existingOrg = await Org.findOne({
    name: validate.data.name.trim(),
  })

  if (existingOrg) throw new ApiError(409, "Organization already exists")

  const createdOrg = await Org.create({
    name: validate.data.name.trim(),
    owner: req.user._id,
    description: validate.data.description,
    members: validate.data.members || []
  })

  return res
    .status(201)
    .json(new ApiResponse(201, createdOrg, "Organization created successfully"))
})

const getOrgById = asyncHandler(async (req, res) => {
  const validate = getOrgSchema.safeParse(req.params)
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((mess) => mess.message)
    )

  const org = await Org.findById(validate.data.orgId)
  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN

  const isOwnOrg =
    org.owner.toString() === req.user._id.toString() ||
    org.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    )

  if (!isSuperAdmin && !isOwnOrg)
    throw new ApiError(403, "You are not allowed to access this organization")

  return res
    .status(200)
    .json(new ApiResponse(200, org, "Organization fetched successfully"))
})

const getOrgs = asyncHandler(async (req, res) => {
  let orgs = []

  if (req.user.role === UserRolesEnum.SUPER_ADMIN) {
    orgs = await Org.find()
      .populate("owner", "email role")
      .populate("members", "email role")
  } else {
    orgs = await Org.find({
      $or: [
        {
          owner: req.user._id,
        },
        {
          members: req.user._id,
        },
      ],
    })
      .populate("owner", "email role")
      .populate("members", "email role")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orgs, "Organizations fetched successfully"))
})

const updateOrg = asyncHandler(async (req, res) => {
  const validate = updateOrgSchema.safeParse({
    ...req.params,
    ...req.body,
  })
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((mess) => mess.message)
    )

  const org = await Org.findById(validate.data.orgId)
  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN

  const isOwnOrgAdmin =
    req.user.role === UserRolesEnum.ADMIN &&
    org.owner.toString() === req.user._id.toString()

  if (!isSuperAdmin && !isOwnOrgAdmin)
    throw new ApiError(403, "You are not allowed to update this organization")

  if (validate.data.name) org.name = validate.data.name.trim()

  if (validate.data.description)
    org.description = validate.data.description.trim()

  if (validate.data.members) {
    for (const memberId of validate.data.members) {
      const user = await User.findById(memberId)
      if (!user) throw new ApiError(404, "User not found")

      if (org.owner.toString() === memberId) {
        throw new ApiError(400, "User is already the owner of the organization")
      }

      const isMemberAlready = org.members.some((id) => id.toString() === memberId)

      if (isMemberAlready) {
        throw new ApiError(400, "User is already a member of the organization")
      }
    }

    org.members = validate.data.members
  }

  await org.save()

  return res
    .status(200)
    .json(new ApiResponse(200, org, "Organization updated successfully"))
})

const deleteOrg = asyncHandler(async (req, res) => {
  const validate = deleteOrgSchema.safeParse(req.params)
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((mess) => mess.message)
    )

  const org = await Org.findById(validate.data.orgId)
  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN
  if (!isSuperAdmin)
    throw new ApiError(403, "Only super admins can delete organizations")

  await org.deleteOne()

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Organization deleted successfully"))
})

const addOrgMember = asyncHandler(async (req, res) => {
  const validate = addOrgMemberSchema.safeParse({
    ...req.params,
    ...req.body,
  })
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((mess) => mess.message)
    )

  const { orgId, memberId } = validate.data

  const org = await Org.findById(orgId)
  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN
  const isOwnOrgAdmin =
    req.user.role === UserRolesEnum.ADMIN &&
    org.owner.toString() === req.user._id.toString()

  if (!isSuperAdmin && !isOwnOrgAdmin)
    throw new ApiError(
      403,
      "You are not allowed to add members to this organization"
    )

  const user = await User.findById(memberId)
  if (!user) throw new ApiError(404, "User not found")

  if (org.owner.toString() === memberId) {
    throw new ApiError(400, "User is already the owner of the organization")
  }

  const isMemberAlready = org.members.some((id) => id.toString() === memberId)

  if (isMemberAlready) {
    throw new ApiError(400, "User is already a member of the organization")
  }

  org.members.push(memberId)
  await org.save()

  return res
    .status(200)
    .json(
      new ApiResponse(200, org, "Member added to organization successfully")
    )
})

export { createOrg, getOrgById, getOrgs, updateOrg, deleteOrg, addOrgMember }
