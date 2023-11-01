import { db } from "@utils/firebase"
import { doc, deleteDoc, collection } from "firebase/firestore"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const draftsCollectionRef = collection(db, "drafts")
  const draftsDoc = doc(draftsCollectionRef, params.id)
  try {
    await deleteDoc(draftsDoc)
    return new Response('success', {status: 200})
  } catch (err) {
      return new Response(`Server Error: ${err}`, { status: 500 });
  }

}