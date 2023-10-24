import { dataURLtoBlob } from "@utils/dataURLtoBlob"
import { db, storage } from "@utils/firebase"
import { isBase64Image } from "@utils/isBase64Image"
import { addDoc, setDoc, doc, getDoc, collection, serverTimestamp } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

export async function POST(request: Request) {
  const { formId, object } = await request.json()

  object.created_at = serverTimestamp()

  const formsCollectionRef = collection(db, "forms")
  const formsRef = formId ? doc(formsCollectionRef, formId) : null
  try{
    if(formsRef){
      const documentSnapshot = await getDoc(formsRef)

      if (documentSnapshot.exists()) {

        const data = documentSnapshot.data()

        
        data.main_screens.forEach((screen: any, index: number) => {
          if(object.main_screens[index].image !== undefined &&
             isBase64Image(object.main_screens[index].image)
          ){
            
            if(screen.image !== undefined){
              const imageRef = ref(storage, screen.image);
              deleteObject(imageRef)
            }

            const image = dataURLtoBlob(object.main_screens[index].image);
            const imageRef = ref(storage, `images/${Date.now() + v4()}`)

            uploadBytes(imageRef, image).then(() => {

              getDownloadURL(imageRef)
                .then((downloadURL) => {
                  object.main_screens[index].image = downloadURL
                })
                .catch((error) => {
                  return new Response(`Error getting download URL: ${error}`, { status: 500 })
                });

            }).catch((error) => {
              return new Response(`Error uploading image: ${error}`, { status: 500 })
            });

          }
        })

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