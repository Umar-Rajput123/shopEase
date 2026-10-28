import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("shopease-token")
  );

  const [loading, setLoading] = useState(true);

  // Restore logged-in user after page refresh
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe(token);
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("shopease-token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const login = async (userData) => {
    const data = await loginUser(userData);

    localStorage.setItem("shopease-token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } finally {
      localStorage.removeItem("shopease-token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};