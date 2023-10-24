//?: fetchFormByID related

import { db } from "@utils/firebase"
import { doc, getDoc, collection } from "firebase/firestore"
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const formsCollectionRef = collection(db, "forms")
  try {
    const formDocRef = doc(formsCollectionRef, params.id);
    const formDocSnapshot = await getDoc(formDocRef);

    if (formDocSnapshot.exists()) {
      const formData = formDocSnapshot.data();
      if (formData) {
        const { main_screens, final_screens, score_points } = formData;

        const response = {
          main_screens,
          final_screens,
          score_points
        };

        return NextResponse.json(response)
      }
    } else {
      return new Response('Form not found', { status: 404 });  
    }
  } catch (error) {
    return new Response(`Server Error: ${error}`, { status: 500 });
  }

}