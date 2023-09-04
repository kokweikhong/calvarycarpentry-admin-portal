import * as z from "zod";

// id SERIAL PRIMARY KEY,
// username VARCHAR(255) NOT NULL UNIQUE,
// email VARCHAR(255) NOT NULL UNIQUE,
// password VARCHAR(255) NOT NULL,
// role VARCHAR(255) NOT NULL,
// department VARCHAR(255) NOT NULL,
// profile_image VARCHAR(255) NOT NULL,
// is_exist BOOLEAN NOT NULL,
// created_at TIMESTAMP NOT NULL,
// updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(2, { message: "Username is required." }),
  email: z.string().email({ message: "Email is required." }),
  password: z.string().min(6, { message: "Password is required." }),
  role: z.string(),
  department: z.string(),
  profileImage: z
    .string()
    .min(2, { message: "Profile image is required." })
    .or(
      z.any().refine((file) => file.length === 1, {
        message: "Profile image is required.",
      })
    ),
  isExist: z.boolean(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type UserValues = z.infer<typeof UserSchema>;
