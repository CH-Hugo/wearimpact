import jwt from 'jsonwebtoken'

export function verifierToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) return { erreur: 'Token manquant', status: 401 }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { userId: decoded.id }
  } catch {
    return { erreur: 'Token invalide', status: 401 }
  }
}
