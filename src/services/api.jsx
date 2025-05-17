import axios from 'axios';
import { useState } from 'react';




const BASE_URL = 'https://api.localites.in/api';

export const apiBase = { 
   token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU5OTMxNjMsImF1ZCI6InpmLmxvY2FsaXRlcy5tb2JpbGUiLCJpc3MiOiJ6Zl9pZHBfc2VydmljZXNfdjEiLCJpYXQiOjE3NDQ3ODM1NjMsInN1YiI6MTE1MDgsImRhdGEiOnsibmFtZSI6ImxvY2FsaXRlcyIsImFwcGxpY2F0aW9uIjoiemYubG9jYWxpdGVzLmFwaSJ9fQ.x_ggZW-ytcp447tKj_lDiFoUnrDZhUQnbg6tZ1VzxzA',   
   API_BASE: 'https://api.localites.in/api',
   imagePath: "https://localitesstrg.blob.core.windows.net/commkit-ctn/",
};




const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    
  },
}); 

// Axios API Service
export const apiService = {
  get: (endpoint, token = '') => 
    apiClient.get(`${BASE_URL}${endpoint}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
  
  post: (endpoint, body, token = '') => 
    apiClient.post(`${BASE_URL}${endpoint}`, body, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
  
  put: (endpoint, body, token = '') => 
    apiClient.put(`${BASE_URL}${endpoint}`, body, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
  
  delete: (endpoint, token = '') => 
    apiClient.delete(`${BASE_URL}${endpoint}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
};

