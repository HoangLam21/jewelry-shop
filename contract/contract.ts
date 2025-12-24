import { initContract } from "@ts-rest/core";
import { z } from "zod";
const c = initContract();
export const contract = c.router({
  user: c.router({}),
  customer: c.router({
    createCustomer: {
      method: "POST",
      path: "/api/customer/create",
      body: z.object({
        fullName: z.string(),
        phoneNumber: z.string(),
        email: z.string().email(),
        address: z.string(),
        gender: z.string().optional(),
        birthday: z.string().optional(),
      }),
      responses: {},
    },
    getCustomers: {
      method: "GET",
      path: "/api/customer/all",
      responses: {},
    },
    getCustomerById: {
      method: "GET",
      path: "/api/customer/id",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    updateCustomer: {
      method: "PUT",
      path: "/api/customer/update",
      body: z.object({
        fullName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        gender: z.string().optional(),
        birthday: z.string().optional(),
      }),
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    deleteCustomer: {
      method: "DELETE",
      path: "/api/customer/delete",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    uploadAvatar: {
      method: "POST",
      path: "/api/customer/upload-avatar",
      responses: {},
      contentType: "multipart/form-data", // <- Only difference
      body: c.type<{ image: File }>(),
      query: z.object({
        id: z.string(),
      }),
    },
  }),
  staff: c.router({
    createStaff: {
      method: "POST",
      path: "/api/staff/create",
      body: z.object({
        fullName: z.string(),
        phoneNumber: z.string(),
        email: z.string().email(),
        address: z.string(),
        avatar: z.string(),
        gender: z.string().optional(),
        birthday: z.string().optional(),
        enrolledDate: z.date(),
        salary: z.string(),
        position: z.string(),
        province: z.string(),
        district: z.string(),
        experience: z.string(),
        kindOfJob: z.string(),
        description: z.string(),
      }),
      responses: {},
    },
    getStaffs: {
      method: "GET",
      path: "/api/staff/all",
      responses: {},
    },
    getStaffById: {
      method: "GET",
      path: "/api/staff/id",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    updateStaff: {
      method: "PUT",
      path: "/api/staff/update",
      body: z.object({
        fullName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        avatar: z.string().optional(),
        gender: z.string().optional(),
        birthday: z.string().optional(),
        enrolledDate: z.date().optional(),
        salary: z.string().optional(),
        position: z.string().optional(),
        province: z.string().optional(),
        district: z.string().optional(),
        experience: z.string().optional(),
        kindOfJob: z.string().optional(),
        description: z.string().optional(),
      }),
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    deleteStaff: {
      method: "DELETE",
      path: "/api/staff/delete",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    uploadAvatar: {
      method: "POST",
      path: "/api/staff/upload-avatar",
      responses: {},
      contentType: "multipart/form-data",
      body: c.type<{ image: File }>(),
      query: z.object({
        id: z.string(),
      }),
    },
  }),
  product: c.router({
    getProducts: {
      method: "GET",
      path: "/api/product/all",
      responses: {},
    },
    getProductById: {
      method: "GET",
      path: "/api/product/id",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    createProduct: {
      method: "POST",
      path: "/api/product/create",
      body: z.object({
        name: z.string(),
        cost: z.number(),
        description: z.string(),
        vouchers: z.array(z.string()).optional(),
        provider: z.string(),
        category: z.string().optional(),
        variants: z.array(
          z.object({
            material: z.string(),
            sizes: z.array(
              z.object({
                size: z.string(),
                stock: z.number(),
              })
            ),
            addOn: z.number(),
          })
        ),
        collections: z.string(),
        images: z.array(z.any()).optional(),
      }),
      responses: {},
    },
    updateProduct: {
      method: "PUT",
      path: "/api/product/update",
      query: z.object({
        id: z.string(),
      }),
      body: z.object({
        name: z.string().optional(),
        cost: z.number().optional(),
        description: z.string().optional(),
        vouchers: z.array(z.string()).optional(),
        provider: z.string().optional(),
        category: z.string().optional(),
        variants: z.array(
          z.object({
            material: z.string(),
            sizes: z.array(
              z.object({
                size: z.string(),
                stock: z.number(),
              })
            ),
            addOn: z.number(),
          })
        ),
        collections: z.string(),
        images: z.array(z.any()).optional(),
      }),
      responses: {},
    },
    deleteProduct: {
      method: "DELETE",
      path: "/api/product/delete",
      responses: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },
  }),
  provider: c.router({
    createProvider: {
      method: "POST",
      path: "/api/provider/create",
      body: z.object({
        name: z.string(),
        address: z.string(),
        contact: z.string(),
        representativeName: z.string(),
        city: z.string(),
        country: z.string(),
      }),
      responses: {},
    },
    getProviders: {
      method: "GET",
      path: "/api/provider/all",
      responses: {
        200: z.array(
          z.object({
            name: z.string(),
            address: z.string(),
            contact: z.string(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },
    getProviderById: {
      method: "GET",
      path: "/api/provider/id",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    updateProvider: {
      method: "PUT",
      path: "/api/provider/update",
      body: z.object({
        name: z.string(),
        address: z.string(),
        contact: z.string(),
        representativeName: z.string(),
        city: z.string(),
        country: z.string(),
      }),
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
    deleteProvider: {
      method: "DELETE",
      path: "/api/provider/delete",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
  }),
  rating: c.router({
    getAllRatings: {
      method: "GET",
      path: "/api/rating/all",
      responses: {},
    },
    createRating: {
      method: "POST",
      path: "/api/rating/create",
      body: z.object({
        userId: z.string().uuid(),
        productId: z.string().uuid(),
        point: z.number().min(1).max(5),
        content: z.string().optional(),
        images: z.string().optional(),
      }),
      responses: {},
    },

    getRatingsByProductId: {
      method: "GET",
      path: "/api/rating/product",
      query: z.object({
        productId: z.string(),
      }),
      responses: {},
    },

    getRatingById: {
      method: "GET",
      path: "/api/rating/id",
      query: z.object({
        id: z.string(),
      }),
      responses: {},
    },

    updateRating: {
      method: "PUT",
      path: "/api/rating/update",
      body: z.object({
        point: z.number().min(1).max(5).optional(),
        content: z.string().optional(),
        images: z.string().optional(),
      }),
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },

    deleteRating: {
      method: "DELETE",
      path: "/api/rating/delete",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
  }),
  voucher: c.router({
    createVoucher: {
      method: "POST",
      path: "/api/voucher/create",
      body: z.object({
        name: z.string(),
        discount: z.number(),
        expDate: z.string(),
      }),
      responses: {
        201: z.object({
          name: z.string(),
          discount: z.number(),
          expDate: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getVouchers: {
      method: "GET",
      path: "/api/voucher/all",
      responses: {
        200: z.array(
          z.object({
            name: z.string(),
            discount: z.number(),
            expDate: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getVoucherById: {
      method: "GET",
      path: "/api/voucher/id",
      query: z.object({
        id: z.string(),
      }),
      responses: {
        200: z.object({
          name: z.string(),
          discount: z.number(),
          expDate: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    updateVoucher: {
      method: "PUT",
      path: "/api/voucher/update",
      body: z.object({
        name: z.string().optional(),
        discount: z.number().optional(),
        expDate: z.string().optional(),
      }),
      responses: {
        200: z.object({
          name: z.string(),
          discount: z.number(),
          expDate: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    deleteVoucher: {
      method: "DELETE",
      path: "/api/voucher/delete",
      responses: {
        200: z.object({
          name: z.string(),
          discount: z.number(),
          expDate: z.string(),
          createdAt: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },
  }),
  finance: c.router({
    createFinance: {
      method: "POST",
      path: "/api/finance/create",
      body: z.object({
        type: z.string(),
        date: z.date(),
        value: z.number(),
      }),
      responses: {
        201: z.object({
          type: z.string(),
          date: z.date(),
          value: z.number(),
          createdAt: z.date(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getFinances: {
      method: "GET",
      path: "/api/finance/all",
      responses: {
        200: z.array(
          z.object({
            type: z.string(),
            date: z.date(),
            value: z.number(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getFinanceById: {
      method: "GET",
      path: "/api/finance/id",
      query: z.object({
        id: z.string(),
      }),
      responses: {
        200: z.object({
          type: z.string(),
          date: z.date(),
          value: z.number(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    updateFinance: {
      method: "PUT",
      path: "/api/finance/update",
      body: z.object({
        type: z.string().optional(),
        date: z.date().optional(),
        value: z.number().optional(),
      }),
      responses: {
        200: z.object({
          type: z.string(),
          date: z.date(),
          value: z.number(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    deleteFinance: {
      method: "DELETE",
      path: "/api/finance/delete",
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },
  }),

  report: c.router({
    createReport: {
      method: "POST",
      path: "/api/report/create",
      body: z.object({
        staff: z.string(),
        finances: z.array(z.string()),
        revenue: z.number(),
      }),
      responses: {
        201: z.object({
          staff: z.string(),
          finances: z.array(z.string()),
          revenue: z.number(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getReports: {
      method: "GET",
      path: "/api/report/all",
      responses: {
        200: z.array(
          z.object({
            staff: z.string(),
            finances: z.array(z.string()),
            revenue: z.number(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getReportById: {
      method: "GET",
      path: "/api/report/id",
      query: z.object({
        id: z.string(),
      }),
      responses: {
        200: z.object({
          staff: z.string(),
          finances: z.array(z.string()),
          revenue: z.number(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    updateReport: {
      method: "PUT",
      path: "/api/report/update",
      body: z.object({
        staff: z.string().optional(),
        finances: z.array(z.string()).optional(),
        revenue: z.number().optional(),
      }),
      responses: {
        200: z.object({
          staff: z.string(),
          finances: z.array(z.string()),
          revenue: z.number(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    deleteReport: {
      method: "DELETE",
      path: "/api/report/delete",
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },
  }),

  order: c.router({
    createOrder: {
      method: "POST",
      path: "/api/order/create",
      body: z.object({
        cost: z.number(),
        discount: z.number(),
        details: z.array(
          z.object({
            id: z.string(),
            material: z.string(),
            size: z.string(),
            unitPrice: z.number(),
            quantity: z.number(),
            discount: z.string(),
          })
        ),
        status: z.string(),
        shippingMethod: z.string(),
        ETD: z.date(),
        customer: z.string(),
        staff: z.string(),
      }),
      responses: {
        201: z.object({
          cost: z.number(),
          discount: z.number(),
          details: z.array(
            z.object({
              id: z.string(),
              material: z.string(),
              size: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.string(),
            })
          ),
          status: z.string(),
          shippingMethod: z.string(),
          ETD: z.date(),
          customer: z.string().optional(),
          phoneNumber: z.string().optional(),
          note: z.string().optional(),
          address: z.string().optional(),
          staff: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getOrders: {
      method: "GET",
      path: "/api/order/all",
      responses: {
        200: z.array(
          z.object({
            id: z.string(),
            suplier: z.object({
              id: z.string(),
              phoneNumber: z.string(),
              fullname: z.string(),
              address: z.string(),
            }),
            invoice: z.array(
              z.object({
                id: z.string(),
                productName: z.string(),
                productImage: z.string(),
                unitPrice: z.number(),
                quantity: z.number(),
                discount: z.number(),
              })
            ),
            status: z.string(),
            createAt: z.date(),
            createBy: z.string(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getOrderById: {
      method: "GET",
      path: "/api/order/id",
      query: z.object({
        id: z.string(),
      }),
      responses: {
        200: z.object({
          id: z.string(),
          suplier: z.object({
            id: z.string(),
            phoneNumber: z.string(),
            fullname: z.string(),
            address: z.string(),
          }),
          invoice: z.array(
            z.object({
              id: z.string(),
              productName: z.string(),
              productImage: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.number(),
            })
          ),
          status: z.string(),
          createAt: z.date(),
          createBy: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    updateOrder: {
      method: "PUT",
      path: "/api/order/update",
      body: z.object({
        cost: z.number().optional(),
        discount: z.number().optional(),
        details: z
          .array(
            z.object({
              id: z.string(),
              material: z.string(),
              size: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.string(),
            })
          )
          .optional(),
        status: z.string().optional(),
        shippingMethod: z.string().optional(),
        ETD: z.date().optional(),
        customer: z.string().optional(),
        staff: z.string().optional(),
      }),
      responses: {
        200: z.object({
          cost: z.number(),
          discount: z.number(),
          details: z.array(
            z.object({
              id: z.string(),
              material: z.string(),
              size: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.string(),
            })
          ),
          status: z.string(),
          shippingMethod: z.string(),
          ETD: z.date(),
          customer: z.string(),
          staff: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    deleteOrder: {
      method: "DELETE",
      path: "/api/order/delete",
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },
    cancelOrder: {
      method: "PATCH",
      path: "/api/order/cancel",
      body: z.object({}),
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },
  }),

  cart: c.router({
    createCart: {
      method: "POST",
      path: "/api/cart/create",
      body: z.object({
        userId: z.string(),
        productId: z.string(),
        quantity: z.number(),
      }),
      responses: {
        201: z.object({
          userId: z.string(),
          productId: z.string(),
          quantity: z.number(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getCart: {
      method: "GET",
      path: "/api/cart",
      query: z.object({
        userId: z.string(),
      }),
      responses: {
        200: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    updateCartProduct: {
      method: "PUT",
      path: "/api/cart/update/product",
      body: z.object({
        productId: z.string(),
        quantity: z.number(),
      }),
      responses: {
        200: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        userId: z.string(),
      }),
    },

    addProductToCart: {
      method: "POST",
      path: "/api/cart/add/product",
      body: z.object({
        userId: z.string(),
        productId: z.string(),
        quantity: z.number(),
      }),
      responses: {
        201: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    addProductsToCart: {
      method: "POST",
      path: "/api/cart/add-products",
      body: z.object({
        userId: z.string(),
        products: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().positive(),
          })
        ),
      }),
      responses: {
        201: z.object({
          userId: z.string(),
          products: z.record(z.number()), // Map<ProductId, Quantity>
          totalCost: z.number(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        }),
        400: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },

    removeProductFromCart: {
      method: "DELETE",
      path: "/api/cart/remove/product",
      responses: {
        200: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        userId: z.string(),
        productId: z.string(),
      }),
    },

    addProductVariantToCart: {
      method: "POST",
      path: "/api/cart/add/product/variant",
      body: z.object({
        userId: z.string(),
        productId: z.string(),
        material: z.string(),
        size: z.string(),
        quantity: z.number(),
      }),
      responses: {
        201: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    removeProductVariantFromCart: {
      method: "DELETE",
      path: "/api/cart/remove/product/variant",
      responses: {
        200: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        userId: z.string(),
        productId: z.string(),
        material: z.string(),
        size: z.string(),
      }),
    },

    editProductVariantQuantityInCart: {
      method: "PUT",
      path: "/api/cart/update/product/variant",
      body: z.object({
        material: z.string(),
        size: z.string(),
        quantity: z.number(),
      }),
      responses: {
        200: z.object({
          userId: z.string(),
          products: z.record(z.number()),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        userId: z.string(),
        productId: z.string(),
      }),
    },

    getCartInformationWithVariants: {
      method: "GET",
      path: "/api/cart/variants",
      query: z.object({
        userId: z.string(),
      }),
      responses: {
        200: z.object({
          userId: z.string(),
          products: z.array(
            z.object({
              product: z.object({
                id: z.string(),
                name: z.string(),
              }),
              variant: z.object({
                material: z.string(),
                size: z.string(),
              }),
              quantity: z.number(),
            })
          ),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
  }),
  category: c.router({
    createCategory: {
      method: "POST",
      path: "/api/category/create",
      body: z.object({
        name: z.string(),
        description: z.string(),
      }),
      responses: {
        201: z.object({
          name: z.string(),
          description: z.string(),
          createdAt: z.date(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getCategories: {
      method: "GET",
      path: "/api/category/all-category",
      responses: {
        200: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getCategoryById: {
      method: "GET",
      path: "/api/category/get",
      responses: {
        200: z.object({
          name: z.string(),
          description: z.string(),
          createdAt: z.date(),
        }),
        400: z.object({ error: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    updateCategory: {
      method: "PUT",
      path: "/api/category/update",
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      }),
      responses: {
        200: z.object({
          name: z.string(),
          description: z.string(),
          createdAt: z.date(),
        }),
        400: z.object({ error: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    deleteCategory: {
      method: "DELETE",
      path: "/api/category/delete",
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    addProductToCategory: {
      method: "POST",
      path: "/api/category/add-product",
      body: z.object({
        categoryId: z.string(),
        productId: z.string(),
      }),
      responses: {
        200: z.object({
          category: z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          }),
          product: z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          }),
        }),
        400: z.object({ error: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    removeProductFromCategory: {
      method: "DELETE",
      path: "/api/category/remove-product",
      responses: {
        200: z.object({
          category: z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          }),
          product: z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          }),
        }),
        400: z.object({ error: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        categoryId: z.string(),
        productId: z.string(),
      }),
    },

    editProductCategory: {
      method: "PUT",
      path: "/api/category/edit-product",
      body: z.object({
        productId: z.string(),
        newCategoryId: z.string(),
      }),
      responses: {
        200: z.object({
          product: z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          }),
          newCategory: z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          }),
        }),
        400: z.object({ error: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getProductsOfCategory: {
      method: "GET",
      path: "/api/category/get-products",
      responses: {
        200: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        categoryId: z.string(),
      }),
    },
  }),

  import: c.router({
    createImport: {
      method: "POST",
      path: "/api/import/create",
      body: z.object({
        staff: z.string(),
        provider: z.string(),
        invoice: z.array(
          z.object({
            productId: z.string(),
            material: z.string(),
            size: z.string(),
            unitPrice: z.number(),
            quantity: z.number(),
            discount: z.string(),
          })
        ),
      }),
      responses: {
        201: z.object({
          id: z.string(),
          supplier: z.object({
            id: z.string(),
            phoneNumber: z.string(),
            fullname: z.string(),
            address: z.string(),
          }),
          invoice: z.array(
            z.object({
              id: z.string(),
              productName: z.string(),
              productImage: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.number(),
            })
          ),
          status: z.boolean(),
          createAt: z.date(),
          createBy: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    getImports: {
      method: "GET",
      path: "/api/import/all",
      responses: {
        200: z.array(
          z.object({
            id: z.string(),
            suplier: z.object({
              id: z.string(),
              phoneNumber: z.string(),
              fullname: z.string(),
              address: z.string(),
            }),
            invoice: z.array(
              z.object({
                id: z.string(),
                productName: z.string(),
                productImage: z.string(),
                unitPrice: z.number(),
                quantity: z.number(),
                discount: z.number(),
              })
            ),
            status: z.boolean(),
            createAt: z.date(),
            createBy: z.string(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getImportById: {
      method: "GET",
      path: "/api/import/id",
      query: z.object({
        id: z.string(),
      }),
      responses: {
        200: z.object({
          id: z.string(),
          suplier: z.object({
            id: z.string(),
            phoneNumber: z.string(),
            fullname: z.string(),
            address: z.string(),
          }),
          invoice: z.array(
            z.object({
              id: z.string(),
              productName: z.string(),
              productImage: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.number(),
            })
          ),
          status: z.boolean(),
          createAt: z.date(),
          createBy: z.string(),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },

    updateImport: {
      method: "PUT",
      path: "/api/import/update",
      body: z.object({
        staff: z.string().optional(),
        totalCost: z.number().optional(),
        details: z
          .array(
            z.object({
              id: z.string(),
              material: z.string(),
              size: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.string(),
            })
          )
          .optional(),
      }),
      responses: {
        200: z.object({
          staff: z.string(),
          totalCost: z.number(),
          details: z.array(
            z.object({
              id: z.string(),
              material: z.string(),
              size: z.string(),
              unitPrice: z.number(),
              quantity: z.number(),
              discount: z.string(),
            })
          ),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    deleteImport: {
      method: "DELETE",
      path: "/api/import/delete",
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    verifyImport: {
      method: "PATCH",
      path: "/api/import/verify",
      body: z.object({}), // Add an empty body object here
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
      query: z.object({
        id: z.string(),
      }),
    },

    getAllImportsOfProvider: {
      method: "GET",
      path: "/api/import/provider",
      query: z.object({
        providerId: z.string(),
      }),
      responses: {
        200: z.array(
          z.object({
            id: z.string(),
            suplier: z.object({
              id: z.string(),
              phoneNumber: z.string(),
              fullname: z.string(),
              address: z.string(),
            }),
            invoice: z.array(
              z.object({
                id: z.string(),
                productName: z.string(),
                productImage: z.string(),
                unitPrice: z.number(),
                quantity: z.number(),
                discount: z.number(),
              })
            ),
            status: z.boolean(),
            createAt: z.date(),
            createBy: z.string(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },

    getAllImportsOfStaff: {
      method: "GET",
      path: "/api/import/staff",
      query: z.object({
        staffId: z.string(),
      }),
      responses: {
        200: z.array(
          z.object({
            id: z.string(),
            suplier: z.object({
              id: z.string(),
              phoneNumber: z.string(),
              fullname: z.string(),
              address: z.string(),
            }),
            invoice: z.array(
              z.object({
                id: z.string(),
                productName: z.string(),
                productImage: z.string(),
                unitPrice: z.number(),
                quantity: z.number(),
                discount: z.number(),
              })
            ),
            status: z.boolean(),
            createAt: z.date(),
            createBy: z.string(),
          })
        ),
        500: z.object({ error: z.string() }),
      },
    },
  }),
  schedule: c.router({
    createSchedule: {
      method: "POST",
      path: "/api/schedule/create",
      body: z.object({
        staff: z.string(),
        shift: z.number(),
        date: z.string(),
      }),
      responses: {},
    },

    updateSchedule: {
      method: "PUT",
      path: "/api/schedule/update",
      body: z.object({
        staff: z.string(),
        shift: z.number(),
        date: z.string(),
      }),
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },

    getAllSchedules: {
      method: "GET",
      path: "/api/schedule/all",
      responses: {},
    },

    getScheduleById: {
      method: "GET",
      path: "/api/schedule/id",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },

    deleteSchedule: {
      method: "DELETE",
      path: "/api/schedule/delete",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },

    getSchedulesOfStaff: {
      method: "GET",
      path: "/api/schedule/staff",
      responses: {},
      query: z.object({
        id: z.string(),
      }),
    },
  }),
});