const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  // ===============================
  // AUTH
  // ===============================

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

  // ===============================
  // DASHBOARD
  // ===============================

  getDashboardOverview: async () => {
    const res = await fetch(
      `${API_URL}/api/admin/dashboard/overview`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  getWeeklySales: async () => {
    const res = await fetch(
      `${API_URL}/api/admin/dashboard/weekly-sales`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // ===============================
  // ADMIN PRODUCTS
  // ===============================

  // Get all products (Admin)
  getAdminProducts: async () => {
    const res = await fetch(
      `${API_URL}/api/admin/products`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // Get product by id
  getAdminProductById: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // Create product
  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/api/admin/products`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // Update product
  updateProduct: async (id: number, formData: FormData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/api/admin/products/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // Toggle product status
  toggleProductStatus: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },
  // Upload product images
  uploadProductImages: async (id: number, files: FileList) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("Images", files[i]); // đúng với swagger của bạn
    }

    const res = await fetch(
      `${API_URL}/api/admin/products/${id}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },
  // Delete product image
  deleteProductImage: async (imageId: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/delete-image/${imageId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },
};