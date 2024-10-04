import sgEmail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY } = process.env;

sgEmail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "merlincat.no@gmail.com" };
  await sgEmail.send(email);
  return true;
};

export default sendEmail;
