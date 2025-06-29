import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Get all checklist items for a specific user.
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<Array>} - List of checklist items
 */
export const getChecklist = async (userId) => {
  const ref = collection(db, "users", userId, "checklists");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Add a new checklist item for a user.
 * @param {string} userId - Firebase Auth UID
 * @param {Object} item - { text, dueDate }
 * @returns {Promise<Object>} - The newly added item
 */
export const addChecklistItem = async (userId, item) => {
  const ref = collection(db, "users", userId, "checklists");
  const newItem = {
    ...item,
    done: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(ref, newItem);
  return { id: docRef.id, ...newItem };
};

/**
 * Update a specific checklist item by document ID.
 * @param {string} userId - Firebase Auth UID
 * @param {string} itemId - Firestore doc ID
 * @param {Object} updates - Fields to update (e.g. { done: true })
 */
export const updateChecklistItem = async (userId, itemId, updates) => {
  const ref = doc(db, "users", userId, "checklists", itemId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a specific checklist item.
 * @param {string} userId - Firebase Auth UID
 * @param {string} itemId - Firestore doc ID
 */
export const deleteChecklistItem = async (userId, itemId) => {
  const ref = doc(db, "users", userId, "checklists", itemId);
  await deleteDoc(ref);
};
