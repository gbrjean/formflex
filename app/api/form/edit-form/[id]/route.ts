import { db } from "@utils/firebase"
import { doc, getDoc, collection } from "firebase/firestore"
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const formsCollectionRef = collection(db, "forms")
  try {
    const formDocRef = doc(formsCollectionRef, params.id);
    const formDocSnapshot = await getDoc(formDocRef);

    if (formDocSnapshot.exists()) {
      let formData = formDocSnapshot.data();
      if (formData) {
        formData = (({ created_at, ...rest }) => rest)(formData)
        return NextResponse.json(formData)
      }
    } else {
      return new Response('Form not found', { status: 500 });  
    }
  } catch (error) {
    return new Response(`Server Error: ${error}`, { status: 500 });
  }

}