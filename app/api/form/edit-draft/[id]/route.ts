import { db } from "@utils/firebase"
import { doc, getDoc, collection } from "firebase/firestore"
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const draftsCollectionRef = collection(db, "drafts")
  try {
    const draftDocRef = doc(draftsCollectionRef, params.id);
    const draftDocSnapshot = await getDoc(draftDocRef);

    if (draftDocSnapshot.exists()) {
      const formData = draftDocSnapshot.data();
      if (formData) {
        return NextResponse.json(formData)
      }
    } else {
      return new Response('Form not found', { status: 404 });  
    }
  } catch (error) {
    return new Response(`Server Error: ${error}`, { status: 500 });
  }

}