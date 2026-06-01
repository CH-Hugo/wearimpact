export async function GET() {
  const response = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/countries', {
    headers: { 'token': process.env.ECOBALYSE_API_TOKEN }
  })
  const data = await response.json()
  return Response.json(data)
}