import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToColor(str: string) {
  // Simple hash function to generate a numeric hash code
  let hashCode = 0;
  for (let i = 0; i < str.length; i++) {
    hashCode = str.charCodeAt(i) + ((hashCode << 5) - hashCode);
  }

  // Convert the numeric hash code to a hexadecimal color code
  let color = (hashCode & 0x00FFFFFF).toString(16).toUpperCase();

  // Pad the color code with zeros if necessary
  while (color.length < 6) {
    color = '0' + color;
  }

  return '#' + color;
}


export const isValidName = (name: string) => {
  // Check if the name is a string with a length between 3 and 30 characters
  if (!name || typeof name !== 'string' || name.length < 3 || name.length > 30) {
    return false;
  }
  // Check if the name contains at least 3 non-white space characters
  const nonSpaceCharacters = name.replace(/\s/g, ''); // Remove white spaces
  if (nonSpaceCharacters.length < 3) {
    return false;
  }
  // If all conditions are met, return true
  return true;
};


export const isEmail = (email: string) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const isValidUsername = (username: string) => {
  // Check if the username is a string with a length between 5 and 30 characters
  if (!username || typeof username !== 'string' || username.length < 5 || username.length > 30) {
    return false;
  }
  // Check if the username contains only lowercase letters, underscores (_), hyphens (-), or at symbols (@)
  const usernameRegex = /^[a-z0-9_-]+$/;
  return usernameRegex.test(username);
};

export const isValidPassword = (password: string) => {
  // Check if the password is a string with a length between 8 and 30 characters
  if (!password || typeof password !== 'string' || password.length < 8 || password.length > 30) {
    return false;
  }
  // Check if the password contains at least one uppercase letter, one lowercase letter, and one unique character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
  return passwordRegex.test(password);
};

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  // Create a shallow copy of the input array
  const result = Array.from(list);
  // Remove the element at the startIndex from the copied array and store it in the 'removed' variable
  const [removed] = result.splice(startIndex, 1);
  // Insert the removed element at the endIndex in the copied array
  result.splice(endIndex, 0, removed);
  // Return the modified array
  return result;
};


