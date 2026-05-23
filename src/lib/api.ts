import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lm_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined" && err.response?.status === 401) {
      localStorage.removeItem("lm_token");
      localStorage.removeItem("lm_user");
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  register: (data: any) => api.post("/auth/register", data).then((r) => r.data),
  login: (data: any) => api.post("/auth/login", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const publicAPI = {
  stats: () => api.get("/public/stats").then((r) => r.data),
  leads: () => api.get("/public/leads").then((r) => r.data),
  offerwalls: () => api.get("/public/offerwalls").then((r) => r.data),
  settings: () => api.get("/public/settings").then((r) => r.data),
};

export const userAPI = {
  dashboard: () => api.get("/user/dashboard").then((r) => r.data),
  activity: (page = 1, type = "all") => api.get(`/user/activity?page=${page}&type=${type}`).then((r) => r.data),
  notifications: () => api.get("/user/notifications").then((r) => r.data),
  markAllRead: () => api.patch("/user/notifications/read-all").then((r) => r.data),
  profile: () => api.get("/user/profile").then((r) => r.data),
  updateProfile: (data: any) => api.patch("/user/profile", data).then((r) => r.data),
  changePassword: (data: any) => api.patch("/user/password", data).then((r) => r.data),
};

export const earnAPI = {
  offerwalls: () => api.get("/offerwalls").then((r) => r.data),
  surveys: () => api.get("/surveys").then((r) => r.data),
  topOffers: () => api.get("/top-offers").then((r) => r.data),
};

export const cashoutAPI = {
  methods: () => api.get("/payment-methods").then((r) => r.data),
  submit: (data: any) => api.post("/cashouts", data).then((r) => r.data),
  history: (page = 1) => api.get(`/cashouts/my?page=${page}`).then((r) => r.data),
};

export const promosAPI = { claim: (code: string) => api.post("/promos/claim", { code }).then((r) => r.data) };
export const referralsAPI = { get: () => api.get("/referrals").then((r) => r.data) };
export const rankingsAPI = { get: (period = "all") => api.get(`/rankings?period=${period}`).then((r) => r.data) };
export const rewardsAPI = {
  dailyBonus: () => api.get("/rewards/daily-bonus").then((r) => r.data),
  claimDaily: () => api.post("/rewards/claim-daily").then((r) => r.data),
  achievements: () => api.get("/rewards/achievements").then((r) => r.data),
};

export const adminAPI = {
  stats: () => api.get("/admin/stats").then((r) => r.data),
  users: (params?: any) => api.get("/admin/users", { params }).then((r) => r.data),
  editUser: (id: number, data: any) => api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  offerwalls: () => api.get("/admin/offerwalls").then((r) => r.data),
  createOfferwall: (data: any) => api.post("/admin/offerwalls", data).then((r) => r.data),
  editOfferwall: (id: number, data: any) => api.patch(`/admin/offerwalls/${id}`, data).then((r) => r.data),
  deleteOfferwall: (id: number) => api.delete(`/admin/offerwalls/${id}`).then((r) => r.data),
  surveys: () => api.get("/admin/surveys").then((r) => r.data),
  createSurvey: (data: any) => api.post("/admin/surveys", data).then((r) => r.data),
  editSurvey: (id: number, data: any) => api.patch(`/admin/surveys/${id}`, data).then((r) => r.data),
  deleteSurvey: (id: number) => api.delete(`/admin/surveys/${id}`).then((r) => r.data),
  topOffers: () => api.get("/admin/top-offers").then((r) => r.data),
  createTopOffer: (data: any) => api.post("/admin/top-offers", data).then((r) => r.data),
  editTopOffer: (id: number, data: any) => api.patch(`/admin/top-offers/${id}`, data).then((r) => r.data),
  deleteTopOffer: (id: number) => api.delete(`/admin/top-offers/${id}`).then((r) => r.data),
  leads: (params?: any) => api.get("/admin/leads", { params }).then((r) => r.data),
  cashouts: (params?: any) => api.get("/admin/cashouts", { params }).then((r) => r.data),
  processCashout: (id: number, data: any) => api.patch(`/admin/cashouts/${id}`, data).then((r) => r.data),
  promos: () => api.get("/admin/promos").then((r) => r.data),
  createPromo: (data: any) => api.post("/admin/promos", data).then((r) => r.data),
  editPromo: (id: number, data: any) => api.patch(`/admin/promos/${id}`, data).then((r) => r.data),
  deletePromo: (id: number) => api.delete(`/admin/promos/${id}`).then((r) => r.data),
  levels: () => api.get("/admin/levels").then((r) => r.data),
  editLevel: (id: number, data: any) => api.patch(`/admin/levels/${id}`, data).then((r) => r.data),
  payments: () => api.get("/admin/payment-methods").then((r) => r.data),
  createPayment: (data: any) => api.post("/admin/payment-methods", data).then((r) => r.data),
  editPayment: (id: number, data: any) => api.patch(`/admin/payment-methods/${id}`, data).then((r) => r.data),
  deletePayment: (id: number) => api.delete(`/admin/payment-methods/${id}`).then((r) => r.data),
  settings: () => api.get("/admin/settings").then((r) => r.data),
  saveSettings: (data: any) => api.patch("/admin/settings", data).then((r) => r.data),
  clearTodayXp: () => api.post("/admin/settings/clear-today-xp").then((r) => r.data),
  postbackLogs: (params?: any) => api.get("/admin/postback-logs", { params }).then((r) => r.data),
  logs: (params?: any) => api.get("/admin/logs", { params }).then((r) => r.data),
  offerPendingRules: () => api.get("/admin/offer-pending/rules").then((r) => r.data),
  addOfferPendingRule: (data: any) => api.post("/admin/offer-pending/rules", data).then((r) => r.data),
  deleteOfferPendingRule: (id: number) => api.delete(`/admin/offer-pending/rules/${id}`).then((r) => r.data),
  pendingLeads: (page = 1) => api.get(`/admin/offer-pending/leads?page=${page}`).then((r) => r.data),
  processPendingLead: (id: number, data: any) => api.patch(`/admin/offer-pending/leads/${id}`, data).then((r) => r.data),
};

export default api;
