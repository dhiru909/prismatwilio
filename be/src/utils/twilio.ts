import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../config/config";

const accountSid =
  TWILIO_ACCOUNT_SID;
const authToken =
  TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendMessage(body: string, to: string) {
  try {
    const message = await client.messages.create({
      from: "+12295959560",
      body,
      to,
    });
    console.log(message.body);
  } catch (e) {
    console.log(e);
    throw new Error("error whlie sending otp");
  }
}
