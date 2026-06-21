import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { verifierToken } from '@/lib/auth'

function dbIndisponible() {
  return Response.json({ error: 'Base de données non configurée' }, { status: 503 })
}

export async function POST(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return Response.json({ error: auth.erreur }, { status: auth.status })
  if (!clientPromise) return dbIndisponible()

  try {
    const { userId } = auth
    const { pays, matieres, impacts } = await request.json()

    const client = await clientPromise
    const db = client.db('wearimpact')
    await db.collection('impacts').insertOne({ userId, pays, matieres, impacts, createdAt: new Date() })

    return Response.json({ message: 'Impact enregistré' }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/vetements]', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return Response.json({ error: auth.erreur }, { status: auth.status })
  if (!clientPromise) return dbIndisponible()

  try {
    const { userId } = auth
    const client = await clientPromise
    const db = client.db('wearimpact')
    const impacts = await db.collection('impacts').find({ userId }).toArray()

    return Response.json(impacts, { status: 200 })
  } catch (error) {
    console.error('[GET /api/vetements]', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return Response.json({ error: auth.erreur }, { status: auth.status })
  if (!clientPromise) return dbIndisponible()

  try {
    const { userId } = auth
    const { id } = await request.json()

    if (!id || !ObjectId.isValid(id)) {
      return Response.json({ error: 'Identifiant invalide' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('wearimpact')
    await db.collection('impacts').deleteOne({ _id: new ObjectId(id), userId })

    return Response.json({ message: 'Vêtement supprimé' }, { status: 200 })
  } catch (error) {
    console.error('[DELETE /api/vetements]', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const auth = verifierToken(request)
  if (auth.erreur) return Response.json({ error: auth.erreur }, { status: auth.status })
  if (!clientPromise) return dbIndisponible()

  try {
    const { userId } = auth
    const { id, nom } = await request.json()

    if (!id || !ObjectId.isValid(id)) {
      return Response.json({ error: 'Identifiant invalide' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('wearimpact')
    await db.collection('impacts').updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { nom } }
    )

    return Response.json({ message: 'Nom mis à jour' }, { status: 200 })
  } catch (error) {
    console.error('[PATCH /api/vetements]', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
