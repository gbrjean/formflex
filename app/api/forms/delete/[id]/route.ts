import { db } from "@utils/firebase"
import { doc, deleteDoc, collection } from "firebase/firestore"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const formsCollectionRef = collection(db, "forms")
  const formsDoc = doc(formsCollectionRef, params.id)
  try {
    await deleteDoc(formsDoc)
    return new Response('success', {status: 200})
  } catch (err) {
      return new Response(`Server Error: ${err}`, { status: 500 });
  }

}