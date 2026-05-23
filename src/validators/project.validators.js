import { z } from "zod"

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")

const createProjectSchema = z.object({
  orgId: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters long")
    .max(50, "Project name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Project description cannot exceed 500 characters")
    .optional(),

  members: z.array(objectIdSchema).optional(),
})

const updateProjectSchema = z.object({
  projectId: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters long")
    .max(50, "Project name cannot exceed 50 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Project description cannot exceed 500 characters")
    .optional(),

  members: z.array(objectIdSchema).optional(),
})

const getProjectSchema = z.object({
  projectId: objectIdSchema,
})

const deleteProjectSchema = z.object({
  projectId: objectIdSchema,
})

export {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  deleteProjectSchema,
}
