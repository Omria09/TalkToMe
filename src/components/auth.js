const { ipcRenderer } = window.electron;
import React, { useEffect, useState } from 'react';

/**
 * Checks if the current user is authenticated by retrieving the user's email from the main process.
 *
 * @returns {string} The email of the currently authenticated user, or an empty string if no user is logged in.
 */
export const isAuthenticated = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Send a request to get login data
    ipcRenderer.send("get-current-user");

    // Receive the login data
    ipcRenderer.receive("current-user", (email) => {
      if (email) {
        setEmail(email);
      } else {
        setError("No user logged in");
      }
    });

    // Handle errors
    ipcRenderer.receive("current-user-error", (errorMessage) => {
      setError(`Failed to retrieve user data: ${errorMessage}`);
    });
  }, []);
  return email;
};

/**
 * Retrieves the unique identifier (UID) of the currently authenticated user.
 *
 * @returns {string} The UID of the currently authenticated user, or an empty string if no user is logged in.
 * @throws {string} An error message if there was a failure retrieving the user's UID.
 */
export const useUid = () => {
  const [uid, setUid] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Send a request to get login data
    ipcRenderer.send("get-current-uid");

    // Receive the login data
    ipcRenderer.receive("current-uid", (uid) => {
      if (uid) {
        setUid(uid);
      } else {
        setError("No user logged in");
      }
    });

    // Handle errors
    ipcRenderer.receive("current-uid-error", (errorMessage) => {
      setError(`Failed to retrieve user data: ${errorMessage}`);
    });
  }, []);
  return uid;
};
