import { NextResponse } from 'next/server'
import { db } from "@utils/firebase"
import { getDocs, collection, query, where, orderBy } from "firebase/firestore"

export async function POST(request: Request) {
  const { userId } = await request.json()

  const collectionsCollectionRef = collection(db, "collections")
  try {
    const Query = query(collectionsCollectionRef, where("user_id", "==", userId), orderBy("createdAt", "asc"))
    const data = await getDocs(Query)

    const filteredData = data.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
    return NextResponse.json(filteredData)
  } catch (err) {
    return new Response(`Server error: ${err}`, {status: 500})
  }
}