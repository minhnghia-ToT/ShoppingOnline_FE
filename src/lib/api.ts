const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ===============================
// HELPERS
// ===============================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Safe response handler (KHÔNG BAO GIỜ CRASH)
const handleResponse = async (res: Response) => {
  const contentType = res.headers.get("content-type");

  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      data = text || null;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
      (typeof data === "string" ? data : "Something went wrong")
    );
  }

  return data;
};

export const api = {
  // ===============================
  // AUTH
  // ===============================

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(res);
  },

  register: async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  // ===============================
  // DASHBOARD
  // ===============================

  getDashboardOverview: async () => {
    const res = await fetch(
      `${API_URL}/api/admin/dashboard/overview`,
      { headers: getAuthHeaders() }
    );

    return handleResponse(res);
  },

  getWeeklySales: async () => {
    const res = await fetch(
      `${API_URL}/api/admin/dashboard/weekly-sales`,
      { headers: getAuthHeaders() }
    );

    return handleResponse(res);
  },

  // ===============================
  // ADMIN PRODUCTS
  // ===============================

  getAdminProducts: async () => {
    const res = await fetch(
      `${API_URL}/api/admin/products`,
      { headers: getAuthHeaders() }
    );

    return handleResponse(res);
  },

  getAdminProductById: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}`,
      { headers: getAuthHeaders() }
    );

    return handleResponse(res);
  },

  // ===============================
  // CREATE PRODUCT (FormData)
  // ===============================

  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/api/admin/products`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // KHÔNG set Content-Type khi dùng FormData
        },
        body: formData,
      }
    );

    return handleResponse(res);
  },

  // ===============================
  // UPDATE PRODUCT (JSON mới của bạn)
  // ===============================

  updateProduct: async (
    id: number,
    data: {
      name: string;
      description: string;
      price: number;
      discountPrice: number;
      stockQuantity: number;
      status: string;
      categoryId: number;
      newImages: {
        imageUrl: string;
        isMain: boolean;
      }[];
    }
  ) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    return handleResponse(res);
  },

  // ===============================
  // TOGGLE STATUS
  // ===============================

  toggleProductStatus: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(res);
  },

  // ===============================
  // UPLOAD IMAGES
  // ===============================

  uploadProductImages: async (id: number, files: FileList) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("Images", files[i]);
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

    return handleResponse(res);
  },

  // ===============================
  // DELETE PRODUCT
  // ===============================

  deleteProduct: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    await handleResponse(res);
    return true;
  },

  // ===============================
  // DELETE PRODUCT IMAGE
  // ===============================

  deleteProductImage: async (imageId: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/images/${imageId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    await handleResponse(res);
    return true;
  },
  // Update product status
  updateProductStatus: async (id: number, status: string) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/${id}/status`,
      {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status), 
      }
    );

    return handleResponse(res);
  },
};