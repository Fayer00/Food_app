import axios from 'axios';

// Create a base instance for API calls
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Create a separate instance for auth calls that doesn't include the API prefix
export const authClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to requests if available
const addAuthHeader = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
};

apiClient.interceptors.request.use(addAuthHeader);
authClient.interceptors.request.use(addAuthHeader);

export default apiClient;