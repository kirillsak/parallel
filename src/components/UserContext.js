import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("loggedInUser");
  const [loggedInUser, setLoggedInUser] = useState(storedUser || null);

  useEffect(() => {
    if (loggedInUser) {
      sessionStorage.setItem("loggedInUser", loggedInUser);
    } else {
      sessionStorage.removeItem("loggedInUser");
    }
  }, [loggedInUser]);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};
