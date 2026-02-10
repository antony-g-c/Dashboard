import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000";

export const getCustomers = () => axios.get(`${API_BASE}/customers/`);
export const addCustomer = (customer) => axios.post(`${API_BASE}/customers/`, customer);

export const getOrders = () => axios.get(`${API_BASE}/orders/`);
export const addOrder = (order) => axios.post(`${API_BASE}/orders/`, order);

export const getOrderItems = () => axios.get(`${API_BASE}/order-items/`);
export const addOrderItem = (item) => axios.post(`${API_BASE}/order-items/`, item);