const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // Analytics methods
  async getDashboardAnalytics(storeId, timeRange = '24h') {
    const params = new URLSearchParams();
    if (storeId) params.append('storeId', storeId);
    if (timeRange) params.append('timeRange', timeRange);
    
    return this.request(`/analytics/dashboard?${params.toString()}`);
  }

  async getShrinkageAnalytics() {
    return this.request('/analytics/shrinkage');
  }

  async getIncidentTrends(storeId, days = 30) {
    const params = new URLSearchParams();
    if (storeId) params.append('storeId', storeId);
    if (days) params.append('days', days);
    
    return this.request(`/analytics/trends?${params.toString()}`);
  }

  async getCrowdFlowAnalytics(storeId, timeRange = '24h') {
    const params = new URLSearchParams();
    if (storeId) params.append('storeId', storeId);
    if (timeRange) params.append('timeRange', timeRange);
    
    return this.request(`/analytics/crowd-flow?${params.toString()}`);
  }

  // Demo requests methods
  async createDemoRequest(demoData) {
    return this.request('/demo-requests', {
      method: 'POST',
      body: JSON.stringify(demoData)
    });
  }

  async getDemoRequests(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/demo-requests?${queryParams.toString()}`);
  }

  async getDemoRequestById(id) {
    return this.request(`/demo-requests/${id}`);
  }

  async updateDemoRequestStatus(id, status, notes) {
    return this.request(`/demo-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  // Stores methods
  async getStores(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/stores?${queryParams.toString()}`);
  }

  async getStoreById(id) {
    return this.request(`/stores/${id}`);
  }

  async createStore(storeData) {
    return this.request('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData)
    });
  }

  async updateStore(id, storeData) {
    return this.request(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storeData)
    });
  }

  async deleteStore(id) {
    return this.request(`/stores/${id}`, {
      method: 'DELETE'
    });
  }

  async getStoreAnalytics(id, timeRange = '24h') {
    const params = new URLSearchParams();
    if (timeRange) params.append('timeRange', timeRange);
    
    return this.request(`/stores/${id}/analytics?${params.toString()}`);
  }

  // Cameras methods
  async getCameras(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/cameras?${queryParams.toString()}`);
  }

  async getCameraById(id) {
    return this.request(`/cameras/${id}`);
  }

  async createCamera(cameraData) {
    return this.request('/cameras', {
      method: 'POST',
      body: JSON.stringify(cameraData)
    });
  }

  async updateCamera(id, cameraData) {
    return this.request(`/cameras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cameraData)
    });
  }

  async deleteCamera(id) {
    return this.request(`/cameras/${id}`, {
      method: 'DELETE'
    });
  }

  async updateCameraStatus(id, status) {
    return this.request(`/cameras/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async getCameraAnalytics(id, timeRange = '24h') {
    const params = new URLSearchParams();
    if (timeRange) params.append('timeRange', timeRange);
    
    return this.request(`/cameras/${id}/analytics?${params.toString()}`);
  }

  // Alerts methods
  async getAlerts(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/alerts?${queryParams.toString()}`);
  }

  async getAlertById(id) {
    return this.request(`/alerts/${id}`);
  }

  async createAlert(alertData) {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
  }

  async resolveAlert(id, notes) {
    return this.request(`/alerts/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    });
  }

  async getAlertStats(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/alerts/stats?${queryParams.toString()}`);
  }

  // Export methods
  async exportData(type, format, params = {}) {
    const queryParams = new URLSearchParams({ ...params, format });
    return this.request(`/export/${type}?${queryParams.toString()}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
