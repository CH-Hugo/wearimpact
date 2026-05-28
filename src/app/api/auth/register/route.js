import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const body = await request.json()
    const email = body.email?.toLowerCase()
    const password = body.password

    if (!email || !password) {
      return Response.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('wearimpact')
    const users = db.collection('users')

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return Response.json({ error: 'Utilisateur déjà existant' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await users.insertOne({ email, password: hashedPassword, createdAt: new Date() })

const token = jwt.sign(
  { id: result.insertedId, email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

return Response.json({ message: 'Utilisateur créé avec succès', token })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
