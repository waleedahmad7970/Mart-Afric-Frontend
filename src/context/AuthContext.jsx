import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const KEY = "sahel-auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password required");
    const isAdmin = email.toLowerCase().includes("admin");
    persist({
      id: isAdmin ? "u1" : "u-" + email,
      name: email.split("@")[0],
      email,
      role: isAdmin ? "admin" : "customer",
    });
  };

  const signup = async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error("All fields required");
    persist({ id: "u-" + email, name, email, role: "customer" });
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
