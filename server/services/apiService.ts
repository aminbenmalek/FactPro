
const API_URL = '/api';

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('factupro_user') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': user.token ? `Bearer ${user.token}` : ''
  };
};

export const apiService = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json();
  },
  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur de sauvegarde');
    return res.json();
  },
  async put(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur de mise à jour');
    return res.json();
  },
  async delete(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erreur de suppression');
    return res.json();
  }
};
