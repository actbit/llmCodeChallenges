export type AuthResponse = {
  userId: string;
  userName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

const API_BASE_URL = "/backend";

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Failed to log in. Please check your email and password.";
      try {
        const errorBody = await response.json();
        // Handle validation errors
        if (errorBody.errors) {
          const validationErrors = Object.entries(errorBody.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("; ");
          message = validationErrors || errorBody.title || errorBody.detail || message;
        } else {
          message = errorBody?.title || errorBody?.detail || message;
        }
      } catch {
        // Ignore JSON parse issues and fall back to default message.
      }
      throw new Error(message);
    }

    return response.json();
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Failed to register. Please try again.";
      try {
        const errorBody = await response.json();
        // Handle validation errors
        if (errorBody.errors) {
          const validationErrors = Object.entries(errorBody.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("; ");
          message = validationErrors || errorBody.title || errorBody.detail || message;
        } else {
          message = errorBody?.title || errorBody?.detail || message;
        }
      } catch {
        // Ignore JSON parse issues and fall back to default message.
      }
      throw new Error(message);
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to log out.");
    }
  },

  async me(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info.");
    }

    return response.json();
  },
};
