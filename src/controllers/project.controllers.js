import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Project from "../models/project.models.js"
import Org from "../models/org.models.js"
import {
  createProjectSchema,
  getProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
} from "../validators/project.validators.js"
import { UserRolesEnum } from "../constants.js"

const createProject = asyncHandler(async (req, res) => {
  const validate = createProjectSchema.safeParse(req.body)
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((err) => err.message)
    )

  const { orgId, name, description, members } = validate.data

  const org = await Org.findById(orgId)

  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN

  const isOwnOrgAdmin =
    req.user.role === UserRolesEnum.ADMIN &&
    org.owner.toString() === req.user._id.toString()

  if (!isSuperAdmin && !isOwnOrgAdmin)
    throw new ApiError(
      403,
      "You are not allowed to create projects in this organization"
    )

  const existingProject = await Project.findOne({
    org: org._id,
    name: name.trim(),
  })

  if (existingProject)
    throw new ApiError(
      409,
      "Project with this name already exists in this organization"
    )

  if (members?.length) {
    const allowedMembers = [
      ...new Set([
        ...org.members.map((id) => id.toString()),
        org.owner.toString(),
      ]),
    ]

    const invalidMembers = members.filter(
      (memberId) => !allowedMembers.includes(memberId.toString())
    )

    if (invalidMembers.length > 0)
      throw new ApiError(400, "Some users are not part of this organization")
  }

  const project = await Project.create({
    name: name.trim(),
    description: description?.trim(),
    org: org._id,
    members: members || [],
    createdBy: req.user._id,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"))
})

const getProject = asyncHandler(async (req, res) => {
  const validate = getProjectSchema.safeParse(req.params)
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((err) => err.message)
    )

  const project = await Project.findById(validate.data.projectId)
    .populate("org", "name owner")
    .populate("members", "username email")
    .populate("createdBy", "username email")

  if (!project) throw new ApiError(404, "Project not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN

  const isOwnOrgAdmin =
    req.user.role === UserRolesEnum.ADMIN &&
    project.org?.owner.toString() === req.user._id.toString()

  const isProjectMember = project.members.some(
    (member) => member._id.toString() === req.user._id.toString()
  )

  if (!isSuperAdmin && !isOwnOrgAdmin && !isProjectMember) {
    throw new ApiError(403, "You are not allowed to access this project")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"))
})

const updateProject = asyncHandler(async (req, res) => {
  const validate = updateProjectSchema.safeParse({
    ...req.params,
    ...req.body,
  })
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((err) => err.message)
    )

  const { projectId, name, description, members } = validate.data

  const project = await Project.findById(projectId)

  if (!project) throw new ApiError(404, "Project not found")

  const org = await Org.findById(project.org)

  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN

  const isOwnOrgAdmin =
    req.user.role === UserRolesEnum.ADMIN &&
    org.owner.toString() === req.user._id.toString()

  if (!isSuperAdmin && !isOwnOrgAdmin)
    throw new ApiError(403, "You are not allowed to update this project")

  if (name) project.name = name.trim()

  if (description !== undefined) project.description = description?.trim()

  if (members !== undefined) project.members = members

  await project.save()

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"))
})

const deleteProject = asyncHandler(async (req, res) => {
  const validate = deleteProjectSchema.safeParse(req.params)
  if (!validate.success)
    throw new ApiError(
      400,
      validate.error.issues.map((err) => err.message)
    )

  const project = await Project.findById(validate.data.projectId)

  if (!project) throw new ApiError(404, "Project not found")

  const org = await Org.findById(project.org)
  if (!org) throw new ApiError(404, "Organization not found")

  const isSuperAdmin = req.user.role === UserRolesEnum.SUPER_ADMIN

  const isOwnOrgAdmin =
    req.user.role === UserRolesEnum.ADMIN &&
    org.owner.toString() === req.user._id.toString()

  if (!isSuperAdmin && !isOwnOrgAdmin)
    throw new ApiError(403, "You are not allowed to delete this project")

  await project.deleteOne()

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"))
})

const getProjects = asyncHandler(async (req, res) => {
  let query = {}

  if (req.user.role === UserRolesEnum.SUPER_ADMIN) {
    query = {}
  } else if (req.user.role === UserRolesEnum.ADMIN) {
    const orgs = await Org.find({ owner: req.user._id }).select("_id")
    const orgIds = orgs.map((org) => org._id)
    query = { org: { $in: orgIds } }
  } else {
    query = { members: req.user._id }
  }

  const projects = await Project.find(query)
    .populate("org", "name owner")
    .populate("members", "username email")
    .populate("createdBy", "username email")

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"))
})

export { createProject, getProject, getProjects, updateProject, deleteProject }
