const API = 'https://trendaura-production-06c0.up.railway.app'

export const generateScript = async (prompt) => {
  const response = await fetch(`${API}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  const data = await response.json()
  return data.result
}

export const fetchTrends = async (niche = '') => {
  try {
    const response = await fetch(`${API}/api/ai/trends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche })
    })
    const data = await response.json()
    return data.trends || []
  } catch {
    return []
  }
}

export const fetchHashtags = async (topic = '') => {
  try {
    const response = await fetch(`${API}/api/ai/hashtags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    })
    const data = await response.json()
    return data.hashtags || []
  } catch {
    return []
  }
}