
const API_BASE_URL = `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

// wrapper function for fetch that allows you to do a generic get/post and one generic error handler for all cases which is much cooler
// than what I made for the apiSlice for Apollo (every reducer had its own repeated error handling)
// The RequestInit is basically what the fetch API expects as it's 2nd argument.
// so we can use that here and use that Interface to give a definition to Body (BodyInit) which is something config will undertstand when it
// gets it set as a key and customConfig which is basically an object of various random things like extra headers, keep-alive, method, mode, priority, etc.
// basically a bunch of extra fields you can see in the request tab of a browser window that we usually don't care about
// but can be set here if we really need them

export async function client(endpoint: string, { body, ...customConfig }: RequestInit = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig?.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(API_BASE_URL + endpoint, config)
    data = await response.json()
    if (response.ok) {
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(data.message)
  } catch (err: any) {
    return Promise.reject(err ? err : data)
  }
}

client.get = function (endpoint: string, customConfig = {}) {
  return client(endpoint, { ...customConfig })
}

client.post = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}