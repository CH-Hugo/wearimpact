import jwt from 'jsonwebtoken'

const PAYS_MAPPING = {
  france: 'FR', chine: 'CN', china: 'CN', bangladesh: 'BD',
  inde: 'IN', india: 'IN', turquie: 'TR', turkey: 'TR',
  portugal: 'PT', italie: 'IT', italy: 'IT', maroc: 'MA',
  vietnam: 'VN', cambodge: 'KH', myanmar: 'MM', pakistan: 'PK',
  espagne: 'ES', spain: 'ES',
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return Response.json({ error: 'Token invalide' }, { status: 401 })
    }
  }

  try {
    const body = await request.json()

    if (!body.matieres || body.matieres.length === 0) {
      return Response.json({ error: 'Matières requises' }, { status: 400 })
    }

    const matResp = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/materials', {
      headers: { token: process.env.ECOBALYSE_API_TOKEN },
    })
    if (!matResp.ok) throw new Error(`Ecobalyse materials : HTTP ${matResp.status}`)
    const materials = await matResp.json()

    const trouverMatiere = (nom) =>
      materials.find((m) => m.name.toLowerCase().includes(nom.toLowerCase()))

    const materiesEcobalyse = body.matieres
      .map((m) => {
        if (m.id) return { id: m.id, share: m.share }
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
    if (!simResp.ok) throw new Error(`Ecobalyse simulator : HTTP ${simResp.status}`)

    const impact = await simResp.json()
    return Response.json(impact)
  } catch (err) {
    console.error('[/api/impact]', err.message)
    return Response.json({ error: 'Erreur lors du calcul' }, { status: 500 })
  }
}
