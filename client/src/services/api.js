export const generateScript = async (prompt) => {
  const response = await fetch('http://192.168.8.168:5000/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  const data = await response.json()
  return data.result
}

export const fetchTrends = async (niche = '') => {
  try {
    const response = await fetch('http://192.168.8.168:5000/api/ai/trends', {
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
    const response = await fetch('http://192.168.8.168:5000/api/ai/hashtags', {
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