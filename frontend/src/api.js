import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getAllIssues = () => API.get('/issues');
export const getIssue = (id) => API.get(`/issues/${id}`);
export const createIssue = (formData) => API.post('/issues', formData);
export const updateStatus = (id, status) => API.patch(`/issues/${id}/status`, { status });
export const upvoteIssue = (id) => API.patch(`/issues/${id}/upvote`);
export const deleteIssue = (id) => API.delete(`/issues/${id}`);
export const analyzeImage = (formData) => API.post('/ai/analyze-image', formData);
export const chatWithAI = (message, issuesSummary) => API.post('/ai/chat', { message, issuesSummary });