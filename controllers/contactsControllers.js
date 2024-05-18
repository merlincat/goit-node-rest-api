import HttpError from "../helpers/HttpError.js";
import {
  Contact,
  createContactSchema,
  updateContactSchema,
} from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500, "Internal server error"));
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }
  try {
    const { name, email, phone } = req.body;
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }
  try {
    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactFavoriteStatus = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    return next(HttpError(400, "Invalid data: 'favorite' should be boolean"));
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
