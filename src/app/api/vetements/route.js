import clientPromise from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

export async function POST(request) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
        return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        const { pays, matieres, impacts } = await request.json()

        const client = await clientPromise
        const db = client.db('wearimpact')
        const collection = db.collection('impacts')

        const impact = {
            userId,
            pays,
            matieres,
            impacts,
            createdAt: new Date()
        }

        await collection.insertOne(impact)

        return new Response(JSON.stringify({ message: 'Impact enregistré' }), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 })
    }
}

export async function GET(request) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
        return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        const client = await clientPromise
        const db = client.db('wearimpact')
        const collection = db.collection('impacts')
        
        const impacts = await collection.find({ userId }).toArray()
        return new Response(JSON.stringify(impacts), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 })
    }
}
