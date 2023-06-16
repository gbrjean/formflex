import { db } from "@utils/firebase"
import { doc, deleteDoc, collection } from "firebase/firestore"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const collectionsCollectionRef = collection(db, "collections")
  const collectionsDoc = doc(collectionsCollectionRef, params.id)
  try {
    await deleteDoc(collectionsDoc)
    return new Response('success', {status: 200})
  } catch (err) {
      return new Response(`Server Error: ${err}`, { status: 500 });
  }

}