import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { verifierToken } from '@/lib/auth'

const DB_INDISPONIBLE = new Response(JSON.stringify({ error: 'Base de données non configurée' }), { status: 503 })

export async function POST(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return new Response(JSON.stringify({ error: auth.erreur }), { status: auth.status })
  if (!clientPromise) return DB_INDISPONIBLE

  try {
    const { userId } = auth
    const { pays, matieres, impacts } = await request.json()

    const client = await clientPromise
    const db = client.db('wearimpact')
    await db.collection('impacts').insertOne({ userId, pays, matieres, impacts, createdAt: new Date() })

    return new Response(JSON.stringify({ message: 'Impact enregistré' }), { status: 201 })
  } catch (error) {
    console.error('[POST /api/vetements]', error)
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 })
  }
}

export async function GET(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return new Response(JSON.stringify({ error: auth.erreur }), { status: auth.status })
  if (!clientPromise) return DB_INDISPONIBLE

  try {
    const { userId } = auth
    const client = await clientPromise
    const db = client.db('wearimpact')
    const impacts = await db.collection('impacts').find({ userId }).toArray()

    return new Response(JSON.stringify(impacts), { status: 200 })
  } catch (error) {
    console.error('[GET /api/vetements]', error)
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return new Response(JSON.stringify({ error: auth.erreur }), { status: auth.status })
  if (!clientPromise) return DB_INDISPONIBLE

  try {
    const { userId } = auth
    const { id } = await request.json()

    if (!id || !ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Identifiant invalide' }), { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('wearimpact')
    await db.collection('impacts').deleteOne({ _id: new ObjectId(id), userId })

    return new Response(JSON.stringify({ message: 'Vêtement supprimé' }), { status: 200 })
  } catch (error) {
    console.error('[DELETE /api/vetements]', error)
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 })
  }
}

export async function PATCH(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return new Response(JSON.stringify({ error: auth.erreur }), { status: auth.status })
  if (!clientPromise) return DB_INDISPONIBLE

  try {
    const { userId } = auth
    const { id, nom } = await request.json()

    if (!id || !ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Identifiant invalide' }), { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('wearimpact')
    await db.collection('impacts').updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { nom } }
    )

    return new Response(JSON.stringify({ message: 'Nom mis à jour' }), { status: 200 })
  } catch (error) {
    console.error('[PATCH /api/vetements]', error)
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 })
  }
}
