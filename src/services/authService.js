/**
 * Authentication and Role Service (Simulated Client-Side)
 * Handles Sign In, Account Creation, Session state, and Role switching.
 */

import { DEMO_USERS } from '../data/demoUsers.js';
import { getCurrentSession, setCurrentSession, clearSession } from './storageService.js';

export function signIn(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();

  // Check demo accounts first
  const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail);

  if (!foundUser) {
    // Check custom registered users in storage
    const customUsers = getCustomUsers();
    const custom = customUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!custom) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (custom.password !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }
    setCurrentSession(custom);
    return { success: true, user: custom };
  }

  if (foundUser.password !== password) {
    return { success: false, error: 'Incorrect password entered.' };
  }

  setCurrentSession(foundUser);
  return { success: true, user: foundUser };
}

export function signUp(name, email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (DEMO_USERS.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const customUsers = getCustomUsers();
  if (customUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  // Create new user (Always assign USER role for security demo requirement)
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password,
    role: 'USER', // Registered users cannot self-assign ADMIN
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    title: 'Media Researcher'
  };

  customUsers.push(newUser);
  localStorage.setItem('mediamine_custom_users', JSON.stringify(customUsers));

  setCurrentSession(newUser);
  return { success: true, user: newUser };
}

export function signOut() {
  clearSession();
}

export function getCustomUsers() {
  try {
    const raw = localStorage.getItem('mediamine_custom_users');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

// Role Switching Preview
export function switchActiveRole(targetRole) {
  const current = getCurrentSession();

  // If user is demo admin or demo user, toggle their role preview state
  const updated = {
    ...current,
    role: targetRole,
    isRolePreview: true
  };

  setCurrentSession(updated);
  return updated;
}
