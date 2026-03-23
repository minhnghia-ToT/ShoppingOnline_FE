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

// Build image url
export const getImageUrl = (path?: string) => {
  if (!path) return "/no-image.png";
  return `${API_URL}${path}`;
};

// Safe response handler
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
  // USER PRODUCTS
  // ===============================

  getProducts: async () => {
    const res = await fetch(`${API_URL}/api/products`);
    return handleResponse(res);
  },

  getUserProductById: async (id: number) => {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    return handleResponse(res);
  },

  searchUserProducts: async (keyword: string) => {
    const res = await fetch(
      `${API_URL}/api/products/search?keyword=${keyword}`
    );

    return handleResponse(res);
  },

  // ===============================
  // USER CART  ⭐ NEW
  // ===============================

  getCart: async () => {
    const res = await fetch(`${API_URL}/api/cart`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  addToCart: async (productId: number, quantity: number) => {
    const res = await fetch(`${API_URL}/api/cart/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    return handleResponse(res);
  },

  updateCart: async (productId: number, quantity: number) => {
    const res = await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    return handleResponse(res);
  },

  removeCartItem: async (productId: number) => {
    const res = await fetch(`${API_URL}/api/cart/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  // ===============================
  // USER ORDERS
  // ===============================

  checkoutCart: async (paymentMethod: string) => {
    const res = await fetch(`${API_URL}/api/orders/checkout-cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        paymentMethod,
      }),
    });

    return handleResponse(res);
  },

  buyNow: async (
    productId: number,
    quantity: number,
    paymentMethod: string
  ) => {
    const res = await fetch(`${API_URL}/api/orders/buy-now`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        productId,
        quantity,
        paymentMethod,
      }),
    });

    return handleResponse(res);
  },

  getMyOrders: async () => {
    const res = await fetch(`${API_URL}/api/orders/my-orders`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  getOrderById: async (id: number) => {
    const res = await fetch(`${API_URL}/api/orders/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  cancelOrder: async (id: number) => {
    const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  // ===============================
  // ADMIN DASHBOARD
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

  updateProduct: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },
  deleteProductImage: async (imageId: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/products/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Delete image failed");
    }

    return true;
  },
  uploadProductImages: async (productId: number, files: File[]) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    files.forEach(file => {
      formData.append("Images", file);
    });

    const res = await fetch(
      `${API_URL}/api/admin/products/${productId}/images`,
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
  updateProductStatus: async (id: number, status: string) => {
    return fetch(`${API_URL}/products/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }).then(res => res.json());
  },
  deleteProduct: async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    await handleResponse(res);
    return true;
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

    return handleResponse(res);
  },

  toggleCategoryStatus: async (id: number) => {
    const res = await fetch(
      `${API_URL}/api/admin/categories/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(res);
  },
  // ===============================
  // USER CATEGORIES ⭐ NEW
  // ===============================

  getCategories: async () => {
    const res = await fetch(`${API_URL}/api/admin/categories`);
    return handleResponse(res);
  },

  getProductsByCategory: async (categoryId: number) => {
    const res = await fetch(
      `${API_URL}/api/products/category/${categoryId}`
    );
    return handleResponse(res);
  },
  // ===============================
  // ADMIN ORDERS
  // ===============================

  getAdminOrders: async () => {
    const res = await fetch(`${API_URL}/api/admin/orders`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  getAdminOrderById: async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  updateOrderStatus: async (id: number, status: string) => {
    const res = await fetch(
      `${API_URL}/api/admin/orders/${id}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          Status: status,
        }),
      }
    );

    return handleResponse(res);
  },

  // ===============================
  // BANNERS
  // ===============================

  getAdminBanners: async () => {
    const res = await fetch(`${API_URL}/api/admin/banners`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  deleteBanner: async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/banners/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    await handleResponse(res);
    return true;
  },

  createBanner: async (file: File) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("Image", file);

    const res = await fetch(`${API_URL}/api/admin/banners`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse(res);
  },
};