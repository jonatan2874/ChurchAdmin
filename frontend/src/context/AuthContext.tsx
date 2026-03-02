import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
const API = import.meta.env.VITE_API_URL;

interface User {
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Función de login local (datos hardcodeados)
// Reemplazar esta función por una llamada al backend cuando esté listo
// ============================================================
async function loginLocal(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simular un pequeño delay como si fuera una petición HTTP
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (username === "admin" && password === "admin") {
    return {
      success: true,
      user: {
        username: "admin",
        name: "Administrador",
      },
    };
  }

  return {
    success: false,
    error: "Usuario o contraseña incorrectos",
  };
}

// ============================================================
// Función de login con backend (descomentar cuando esté listo)
// ============================================================
async function loginBackend(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.message || "Error al iniciar sesión" };
    }

    const data = await response.json();
    return {
      success: true,
      user: {
        username: data.username,
        name: data.name,
      },
    };
  } catch {
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

const AUTH_STORAGE_KEY = "churchadmin_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Usar loginLocal para datos locales
    // Cambiar a loginBackend cuando el backend esté listo
    const result = await loginBackend(username, password);

    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.user));
      return { success: true };
    }

    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
