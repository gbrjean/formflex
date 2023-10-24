import { db } from "@utils/firebase"
import { addDoc, setDoc, doc, getDoc, collection, serverTimestamp } from "firebase/firestore"

export async function POST(request: Request) {
  const { formId, object } = await request.json()

  object.created_at = serverTimestamp()

  const formsCollectionRef = collection(db, "forms")
  const formsRef = formId ? doc(formsCollectionRef, formId) : null
  try{
    if(formsRef){
      const documentSnapshot = await getDoc(formsRef)

      if (documentSnapshot.exists()) {
        await setDoc(formsRef, object)
      } else {
        await addDoc(formsCollectionRef, object)
      }
    } else {
      await addDoc(formsCollectionRef, object)
    }

    return new Response('success', {status: 200})
  } catch (error) {
      return new Response(`Server Error: ${error}`, { status: 500 })
  }

}