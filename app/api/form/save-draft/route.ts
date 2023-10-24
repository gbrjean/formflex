import { db, storage } from "@utils/firebase"
import { isBase64Image } from "@utils/isBase64Image"
import { addDoc, setDoc, doc, getDoc, collection, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid"

export async function POST(request: Request) {
  const { formId, object } = await request.json()

  object.created_at = serverTimestamp()

  const draftsCollectionRef = collection(db, "drafts")
  const draftRef = formId ? doc(draftsCollectionRef, formId) : null

  try{
    if(draftRef){
      const documentSnapshot = await getDoc(draftRef)

      if (documentSnapshot.exists()) {
        await setDoc(draftRef, object)
      } else {
        await addDoc(draftsCollectionRef, object)
      }
    } else {
      await addDoc(draftsCollectionRef, object)
    }

    return new Response('success', {status: 200})
  } catch (error) {
      return new Response(`Server Error: ${error}`, { status: 500 })
  }
  
}