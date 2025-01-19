import { Request, Response } from "express";
import { client } from "../config/db";
import { UserSignUpVerifySchema, UserSignupSchema } from "../types";
import { getToken, verifyToken } from "../utils/totp";
import { sendMessage } from "../utils/twilio";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config/config";
import { genSalt, hash } from "bcrypt";
/**
 * Handles a POST request to /signup
 * Expects the request body to contain the user's email, password, and name
 * If the request body is invalid, returns a 411 error with a message
 * Otherwise, attempts to create a new user in the database
 * If the user creation is successful, returns a 'signup' message
 * If the user creation fails, logs the error to the console
 * @param req - The Express request object
 * @param res - The Express response object
 */
const signup = async (req: Request, res: Response) => {
  const { email, password, number } = req.body;
  const { data, success, error } = UserSignupSchema.safeParse({
    email,
    password,
    number,
  });
  if (!success) {
    res.status(400).json({
      message: error.issues[0].message,
    });
    return;
  }

  try {
    try {
      // generate hash for password before storing to database
      const salt = await genSalt(10);
      const hashedPassword = await hash(data?.password!, salt);

      const user = await client.user.create({
        data: {
          email: data?.email!,
          password: hashedPassword,
          number: data?.number!,
        },
      });
      const totp = getToken(number, "AUTH");
      try {
        await sendMessage(
          `Your otp for logging into PrismaTwilio is ${totp}`,
          "+91" + number
        );
      } catch (e) {
        res.status(500).json({
          message: "Could not send otp",
        });
        return;
      }
      res.json({
        message: "success",
        userId: user.id,
      });
    } catch (error) {
        console.log(error);
        
      res.status(400).json({
        message: "Email already exists",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const signupVerify = async (req: Request, res: Response) => {
  const parsedData = UserSignUpVerifySchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  const number = parsedData.data.number;
  const otp = parsedData.data.totp;
  // process.env.NODE_ENV === "production" &&
  if (!verifyToken(number, "AUTH", otp)) {
    res.json({
      message: "Invalid token",
    });
    return;
  }
  const user = await client.user.update({
    where: {
      number: number,
    },
    data: {
      verified: true,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_PASSWORD
  );

  res.json({
    token,
  });
};

export { signup, signupVerify };
