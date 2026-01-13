// API Configuration
// In production (GitHub Pages), this points to Render backend
// In development, this points to localhost

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('API Base URL:', API_BASE_URL);

export default API_BASE_URL;
