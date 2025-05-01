export const api = {
  base_url: 'http://localhost:3000/api',
  request: async (endpoint, opts) => {
    opts = opts || {};
    const session_id = JSON.parse(localStorage.getItem('user')).session_id;
    const url = `${api.base_url}/${endpoint}?session_id=${session_id}`;
    const method = opts.method || 'GET';
    const headers = {
      'content-type': 'application/json',
    };
    const req_opts = {headers,method};
    if (opts.body) req_opts['body'] = JSON.stringify(opts.body);

    const response = await fetch(url, req_opts);
    return response.json();
  },
  students: {
    list: async (teacher_id) => {
      return await api.request('students');
    },
    create: async (fields) => {
        const response = await api.request('students', {method: 'POST', body: fields});
        return response;
    },
    get: (id) => {},
    edit: async (id, fields) => {
      return await api.request(`students/${id}`, {method: 'PUT', body: fields});
    },
    delete: async (id) => {
      return await api.request(`students/${id}`, {method: 'DELETE'});
    },
  },
  assignments: {
    list: async (teacher_id) => {
      return await api.request('assignments');
    },
    create: async (fields) => {
      return await api.request('assignments', {method: 'POST', body: fields});
    },
    get: (id) => {},
    edit: async (id, fields) => {
      return await api.request(`assignments/${id}`, {method: 'PUT', body: fields});
    },
    delete: async (id) => {
      return await api.request(`assignments/${id}`, {method: 'DELETE'});
    },
  }
};
