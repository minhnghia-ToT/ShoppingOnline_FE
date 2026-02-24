const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  register: async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },
};