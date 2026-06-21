import clientPromise from '@/lib/mongodb'
import { verifierToken } from '@/lib/auth'

const PAYS_MAPPING = {
  france: 'FR', chine: 'CN', china: 'CN', bangladesh: 'BD',
  inde: 'IN', india: 'IN', turquie: 'TR', turkey: 'TR',
  portugal: 'PT', italie: 'IT', italy: 'IT', maroc: 'MA',
  vietnam: 'VN', cambodge: 'KH', myanmar: 'MM', pakistan: 'PK',
  espagne: 'ES', spain: 'ES',
}

export async function POST(request) {
  if (request.headers.get('authorization')) {
    const auth = verifierToken(request)
    if (auth.erreur) return Response.json({ error: auth.erreur }, { status: auth.status })
  }

  try {
    const body = await request.json()

    if (!body.matieres || body.matieres.length === 0) {
      return Response.json({ error: 'Matières requises' }, { status: 400 })
    }

    const matResp = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/materials', {
      headers: { token: process.env.ECOBALYSE_API_TOKEN },
    })
    if (!matResp.ok) {
      console.error('[/api/impact]', `Ecobalyse materials : HTTP ${matResp.status}`)
      return Response.json({ error: 'Service Ecobalyse indisponible' }, { status: 502 })
    }
    const materials = await matResp.json()

    const trouverMatiere = (nom) =>
      materials.find((m) => m.name.toLowerCase().includes(nom.toLowerCase()))

    const materiesEcobalyse = body.matieres
      .map((m) => {
        if (m.id) return { id: m.id, share: m.pourcentage / 100 }
        const mat = trouverMatiere(m.matiere)
        return mat ? { id: mat.id, share: m.pourcentage / 100 } : null
      })
      .filter(Boolean)

    if (materiesEcobalyse.length === 0) {
      return Response.json({ error: 'Aucune matière reconnue' }, { status: 400 })
    }

    const codePays = body.pays
      ? (PAYS_MAPPING[body.pays.toLowerCase()] ?? body.pays.toUpperCase())
      : 'FR'

    const simResp = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/simulator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: process.env.ECOBALYSE_API_TOKEN,
      },
      body: JSON.stringify({
        mass: 0.2,
        product: 'tshirt',
        materials: materiesEcobalyse,
        countryMaking: codePays,
      }),
    })
    if (!simResp.ok) {
      console.error('[/api/impact]', `Ecobalyse simulator : HTTP ${simResp.status}`)
      return Response.json({ error: 'Service Ecobalyse indisponible' }, { status: 502 })
    }

    const impact = await simResp.json()

    if (clientPromise) {
      clientPromise
        .then(client => client.db('wearimpact').collection('stats').updateOne(
          { _id: 'scans' },
          { $inc: { total: 1 } },
          { upsert: true }
        ))
        .catch(err => console.error('[stats]', err.message))
    }

    return Response.json(impact)
  } catch (err) {
    console.error('[/api/impact]', err.message)
    return Response.json({ error: 'Erreur lors du calcul' }, { status: 500 })
  }
}
