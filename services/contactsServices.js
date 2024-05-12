import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
    return JSON.parse(await fs.readFile(contactsPath, "utf-8"));
  } catch (error) {
    throw error;
  }
}

export async function getContactById(contactId) {
  const contactsList = await listContacts();
  const contact = contactsList.find((contact) => contact.id === contactId);
  return contact ? contact : null;
}

export async function removeContact(contactId) {
  const contactsList = await listContacts();
  const contactIndex = contactsList.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex === -1) {
    return null;
  }
  const removedContact = contactsList.splice(contactIndex, 1)[0];
  await fs.writeFile(
    contactsPath,
    JSON.stringify(contactsList, null, 2),
    "utf-8"
  );
  return removedContact;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function updateContactInfo(contactId, updatedData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...updatedData };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}
