import HttpError from "../helpers/HttpError.js";
import {
  Contact,
  createContactSchema,
  updateContactSchema,
  addToFavoriteContactSchema,
} from "../models/contact.js";
import mongoose from "mongoose";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ owner })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500, "Internal server error"));
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { _id: owner } = req.user;
    const contact = await Contact.findOne({ _id: id, owner });
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
    const { _id: owner } = req.user;
    const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });
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
    const { _id: owner } = req.user;
    const newContact = new Contact({ name, email, phone, owner });
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
    const { _id: owner } = req.user;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body,
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

export const updateContactFavoriteStatus = async (req, res, next) => {
  const { error } = addToFavoriteContactSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    return next(HttpError(400, "Invalid data: 'favorite' should be boolean"));
  }

  try {
    const { _id: owner } = req.user;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
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
