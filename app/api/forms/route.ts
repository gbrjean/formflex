import { NextResponse } from 'next/server'
import { db } from "@utils/firebase"
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore"

export async function POST(request: Request) {
  const { userId } = await request.json()

  const formsCollectionRef = collection(db, "forms")
  const Query = query(formsCollectionRef, where("user_id", "==", userId));
  const data = await getDocs(Query)

  const filteredData = await Promise.all(
    data.docs.map(async (docum) => {
      const formData = docum.data()
      const typeId = formData.type_id

      const formsTypeCollectionRef = collection(db, "form_types")
      const typeDocRef = doc(formsTypeCollectionRef, typeId);
      const typeDocSnap = await getDoc(typeDocRef)
      const typeData = typeDocSnap.data()

      return {
        ...formData,
        id: docum.id,
        type: typeData?.name || "Unknown Type",
      }
    })
  )

  return NextResponse.json(filteredData)
}