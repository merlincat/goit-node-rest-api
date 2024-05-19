import mongoose from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError";

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleMongooseError);
export const Contact = model("Contact", contactSchema);

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string()

    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
    .messages({
      "string.pattern.base":
        "Please use correct format for phone number (XXX) XXX-XXXX",
    })
    .required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
    .messages({
      "string.pattern.base":
        "Please use correct format for phone number (XXX) XXX-XXXX",
    }),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });
