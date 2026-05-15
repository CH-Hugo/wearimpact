import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    const body = await request.json()
    const email = body.email.toLowerCase()
    const password = body.password

    const client = await clientPromise
    const db = client.db('wearimpact')
    const users = db.collection('users')
    const existingUser = await users.findOne({ email })
    if (existingUser) {
    return Response.json({ error: 'Utilisateur déjà existant' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await users.insertOne({ email, password: hashedPassword, createdAt: new Date() })

    return Response.json({ message: 'Utilisateur créé avec succès' })
}