function app() { return getApp(); }

const api = {
  get(url, params = {}, needAuth = true) {
    const query = Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
    const fullUrl = query ? `${url}?${query}` : url;
    return app().request(fullUrl, { needAuth });
  },

  post(url, data = {}, needAuth = true) {
    return app().request(url, { method: 'POST', data, needAuth });
  },

  put(url, data = {}, needAuth = true) {
    return app().request(url, { method: 'PUT', data, needAuth });
  },

  del(url, needAuth = true) {
    return app().request(url, { method: 'DELETE', needAuth });
  }
};

module.exports = api;
