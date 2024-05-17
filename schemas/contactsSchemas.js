import Joi from "joi";

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
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });
