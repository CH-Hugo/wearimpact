export async function GET() {
  try {
    const response = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/materials', {
      headers: { token: process.env.ECOBALYSE_API_TOKEN },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return Response.json(data)
  } catch (err) {
    console.error('[/api/materiaux]', err.message)
    return Response.json({ error: 'Impossible de charger les matières' }, { status: 502 })
  }
}
