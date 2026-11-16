
import api from "./api";

export type AnalyticsPeriod = "daily" | "weekly" | "monthly";

export interface AdminAnalytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalVendors: number;
    totalProducts: number;
    deliveredOrders: number;
    pendingOrders: number;
  };

  orderStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };

  salesOverview: {
    date: string;
    revenue: number;
    orders: number;
  }[];

  recentOrders: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    } | null;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }[];

  filters: {
    period: AnalyticsPeriod;
    startDate: string;
    endDate: string;
  };
}

export interface VendorAnalytics {
  summary: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalItemsSold: number;
    pendingOrders: number;
    confirmedOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    lowStockItems: number;
  };

  itemStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };

  salesOverview: {
    date: string;
    revenue: number;
    orders: number;
  }[];

  recentOrders: {
    _id: string;
    customer: {
      _id: string;
      name: string;
      email: string;
    } | null;
    items: {
      product: {
        _id: string;
        name: string;
        price: number;
        images?: string[];
      } | string;
      quantity: number;
      price: number;
      subtotal: number;
      itemStatus?: string;
    }[];
    vendorOrderTotal: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }[];

  lowStockProducts: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images?: string[];
  }[];

  topProducts: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    totalSold: number;
    revenue: number;
  }[];

  filters: {
    period: AnalyticsPeriod;
    startDate: string;
    endDate: string;
  };
}

interface AnalyticsResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getAdminAnalytics = async (
  period: AnalyticsPeriod = "daily"
): Promise<AdminAnalytics> => {
  const response = await api.get<AnalyticsResponse<AdminAnalytics>>(
    `/analytics/admin?period=${period}`
  );

  return response.data.data;
};

export const getVendorAnalytics = async (
  period: AnalyticsPeriod = "daily"
): Promise<VendorAnalytics> => {
  const response = await api.get<AnalyticsResponse<VendorAnalytics>>(
    `/analytics/vendor?period=${period}`
  );

  return response.data.data;
};
