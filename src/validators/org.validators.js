import { z } from "zod"

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")

const createOrgSchema = z.object({
  name: z
    .string({
      required_error: "Org name is required",
    })
    .trim()
    .min(3, "Org name must be at least 3 characters long")
    .max(50, "Org name cannot exceed 50 characters"),
  description: z.string().trim().optional(),
})

const getOrgSchema = z.object({
  orgId: objectIdSchema,
})

const updateOrgSchema = z.object({
  orgId: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(3, "Org name must be at least 3 characters long")
    .max(50, "Org name cannot exceed 50 characters")
    .optional(),
  description: z.string().trim().optional(),
})

const deleteOrgSchema = z.object({
  orgId: objectIdSchema,
})

const addOrgMemberSchema = z.object({
  orgId: objectIdSchema,
  memberId: objectIdSchema,
})

export {
  createOrgSchema,
  getOrgSchema,
  updateOrgSchema,
  deleteOrgSchema,
  addOrgMemberSchema,
}
