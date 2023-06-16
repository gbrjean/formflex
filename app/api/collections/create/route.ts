import { db } from "@utils/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export async function POST(request: Request) {
  const { userId, title } = await request.json()

  const collectionsCollectionRef = collection(db, "collections")
  try{
    await addDoc(collectionsCollectionRef, {
      createdAt: serverTimestamp(),
      forms_no: 0,
      title: title,
      user_id: userId
    })
    return new Response('success', {status: 200})
  } catch (error) {
      return new Response(`Server Error: ${error}`, { status: 500 });
  }

}