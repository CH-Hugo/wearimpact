import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let clientPromise

if (uri) {
  let client
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  console.warn('MONGODB_URI manquant — connexion MongoDB désactivée')
}

export default clientPromise