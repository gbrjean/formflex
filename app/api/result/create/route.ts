//? saveFormCompletion related

import { db } from "@utils/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

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

    await addDoc(resultsCollectionRef, data);

    return new Response('success', {status: 200})
  } catch (error) {
      return new Response(`Server Error: ${error}`, { status: 500 });
  }

}