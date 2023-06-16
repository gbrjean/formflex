import { db } from "@utils/firebase"
import { doc, updateDoc, collection } from "firebase/firestore"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { title } = await request.json()

  const collectionsCollectionRef = collection(db, "collections")
  const collectionsDoc = doc(collectionsCollectionRef, params.id)
  try{
    await updateDoc(collectionsDoc, {
      title: title
    })
    return new Response('success', {status: 200})
  } catch (error) {
      return new Response(`Server Error: ${error}`, { status: 500 });
  }

}