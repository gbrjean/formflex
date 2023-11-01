import { NextResponse } from 'next/server'
import { db } from "@utils/firebase"
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore"

export async function POST(request: Request) {
  const { formId, userId } = await request.json()

  const formsCollectionRef = collection(db, "forms")
  const resultsCollectionRef = collection(db, "results")

  try {
    const formDocRef = doc(formsCollectionRef, formId);
    const formDocSnapshot = await getDoc(formDocRef);

    if (formDocSnapshot.exists()) {
      const formData = formDocSnapshot.data();

      if (formData.user_id === userId) {
        // User is authorized, proceed to search for results
        const Query = query(resultsCollectionRef, where("form_id", "==", formId));
        const resultDocs = await getDocs(Query);

        if (resultDocs.empty) {
          return NextResponse.json([]);
        } else {

          const data = resultDocs.docs.map((doc, index) => {
            const docData = doc.data();
            // Convert Timestamp to Date
            const dateField = docData.completed_at.toDate().toLocaleDateString();
            docData.completed_at = dateField

            return {
              id: doc.id,
              ...docData,
              screen_titles: formData.main_screens.map((screen: any) => {
                return screen.title
              }),
              screen_answers: formData.main_screens.map((screen: any) => {
                return screen.data
              }),
            };
          });

          const response = {
            title: formData.title,
            results: data,
          };

          return NextResponse.json(response);
        }

      } else {
        return new Response("Authorization failed", { status: 500 });
      }
    } else {
      return new Response("Form not found", { status: 404 });
    }
  } catch (error) {
    return new Response(`Server Error: ${error}`, { status: 500 });
  }

  
}