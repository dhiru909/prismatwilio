import z from "zod";

export const UserSignupSchema = z.object({
  email: z
    .string({
      message: "Email required",
    })
    .email("Enter valid email"),
  password: z
    .string({ message: "Password required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,14}$/,
      "Strong password required"
    ),
  number: z
    .string({
      message: "Phone number required",
    })
    .min(10, "Invalid phone number")
    .max(13, "Invalid phone number"),
});


export const UserSignUpVerifySchema = z.object({
    number: z
    .string({
      message: "Phone number required",
    })
    .min(10, "Invalid phone number")
    .max(13, "Invalid phone number"),
    totp: z
    .string({
        message: "OTP required",
    })
    .min(6, "Invalid OTP")
    .max(6, "Invalid OTP")
    // name: z
    // .string({
    //     message: "Name required",
    // })
    // .min(2, "Invalid name")
    // .max(20, "Invalid name"),
})