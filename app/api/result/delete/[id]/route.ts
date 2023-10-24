import { db } from "@utils/firebase"
import { doc, deleteDoc, collection } from "firebase/firestore"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const resultsCollectionRef = collection(db, "results")
  const resultsDoc = doc(resultsCollectionRef, params.id)
  try {
    await deleteDoc(resultsDoc)
    return new Response('success', {status: 200})
  } catch (err) {
      return new Response(`Server Error: ${err}`, { status: 500 });
  }

}