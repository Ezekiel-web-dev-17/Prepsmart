import { z } from "zod";

/**
 * Schema representing a User entity from the database.
 */
export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

/**
 * Summary / list item schema (excluding audit timestamps).
 */
export const userListItemSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type UserListItem = z.infer<typeof userListItemSchema>;

/**
 * Schema for creating a new user (input validation for Server Actions and API routes).
 */
export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must not be empty")
    .max(100, "Name cannot exceed 100 characters")
    .nullish(),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Schema for updating an existing user.
 */
export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().min(1, "User ID is required"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Schema for querying users with pagination.
 */
export const getUsersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
