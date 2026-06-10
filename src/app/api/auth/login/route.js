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

    const user = await users.findOne({ email })
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false

    if (!user || !isPasswordValid) {
      return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return Response.json({ message: 'Connexion réussie', token })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
