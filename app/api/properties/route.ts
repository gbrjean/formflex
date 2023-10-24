import { NextResponse } from 'next/server'
import { db } from "@utils/firebase"
import { getDocs, collection, query } from "firebase/firestore"

export async function GET(request: Request) {

  const formTypes_CollectionRef = collection(db, "form_types")
  const questionsTypes_CollectionRef = collection(db, "questions_type")

  try {
    const formTypes = (await getDocs(formTypes_CollectionRef)).docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }))

    const questionsTypes = (await getDocs(questionsTypes_CollectionRef)).docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }))

    const result = {
      formTypes,
      questionsTypes,
    }

    return NextResponse.json(result)
  } catch (err) {
    return new Response(`Server error: ${err}`, {status: 500})
  }
}