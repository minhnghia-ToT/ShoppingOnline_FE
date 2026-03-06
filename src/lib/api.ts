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

//Build image url
export const getImageUrl = (path?: string) => {
  if (!path) return "/no-image.png";
  return `${API_URL}${path}`;
};

//Safe response handler (KHÔNG BAO GIỜ CRASH)
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
 /* USER PRODUCT */

  getProducts: async () => {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  // ===============================
  // DASHBOARD
  // ===============================

  getDashboardOverview: async () => {
    const res = await fetch(`${API_URL}/api/admin/dashboard/overview`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  getWeeklySales: async () => {
    const res = await fetch(`${API_URL}/api/admin/dashboard/weekly-sales`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  // ===============================
  // ADMIN PRODUCTS
  // ===============================

  getAdminProducts: async () => {
    const res = await fetch(`${API_URL}/api/admin/products`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  getAdminProductById: async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/admin/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse(res);
  },

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
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

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

  deleteProduct: async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    await handleResponse(res);
    return true;
  },

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

  // ===============================
  // ADMIN CATEGORIES
  // ===============================

  getAdminCategories: async () => {
    const res = await fetch(`${API_URL}/api/admin/categories`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  createCategory: async (data: { name: string }) => {
    const res = await fetch(`${API_URL}/api/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  updateCategory: async (data: { id: number; name: string }) => {
    const res = await fetch(`${API_URL}/api/admin/categories`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Update failed");
    }

    return res.json();
  },

  toggleCategoryStatus: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/categories/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error("Toggle status failed");
    }

    return res.json();
  },

  // ===============================
  // USER PRODUCTS
  // ===============================

  getUserProducts: async () => {
    const res = await fetch(`${API_URL}/api/products`);
    return handleResponse(res);
  },

  searchUserProducts: async (keyword: string) => {
    const res = await fetch(
      `${API_URL}/api/products/search?keyword=${keyword}`
    );

    return handleResponse(res);
  },

  // API mới
  getUserProductById: async (id: number) => {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    return handleResponse(res);
  },
};