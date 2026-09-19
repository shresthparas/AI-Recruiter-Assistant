import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

export const api = {
  getHealth: async () => {
    const res = await client.get('/api/health');
    return res.data;
  },

  search: async (query) => {
    const res = await client.post('/api/search', { query });
    return res.data;
  },

  refine: async ({
    query,
    current_filters,
    current_rubric,
    chat_feedback,
    per_candidate_feedback,
    current_candidate_ids,
  }) => {
    const res = await client.post('/api/refine', {
      query,
      current_filters,
      current_rubric,
      chat_feedback,
      per_candidate_feedback,
      current_candidate_ids,
    });
    return res.data;
  },

  manualUpdate: async ({ filters, rubric }) => {
    const res = await client.post('/api/manual-filter', {
      filters,
      rubric,
    });
    return res.data;
  },

  getAllCandidates: async () => {
    const res = await client.get('/api/candidates');
    return res.data;
  },
};
