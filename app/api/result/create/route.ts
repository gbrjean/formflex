//? saveFormCompletion related

import { db } from "@utils/firebase"
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  const { id, email, fullname, answers, score } = await request.json()

  const resultsCollectionRef = collection(db, "results")
  try{
    const data = {
      form_id: id,
      completed_at: serverTimestamp(),
      email: email,
      fullname: fullname,
      answers: answers,
    };
  
    if (score !== undefined) {
      // @ts-ignore
      data.score = score;
    }

    await addDoc(resultsCollectionRef, data)

    const formsCollectionRef = collection(db, "forms")
    const formDocRef = doc(formsCollectionRef, id);
    const formDocSnapshot = await getDoc(formDocRef);

    if (formDocSnapshot.exists()) {
      const formData = formDocSnapshot.data();

      const completions = (formData.completions || 0) + 1;
      await updateDoc(formDocRef, { completions });
    }

    return new Response('success', {status: 200})
  } catch (error) {
      return new Response(`Server Error: ${error}`, { status: 500 });
  }

}