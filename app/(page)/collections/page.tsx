"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@context/AuthContext';

import { Collection } from "@components/Collection"
import css from "@styles/collections.module.scss"
import CreatePrompt from '@components/CreatePrompt';

type CollectionsType = {
  id: string;
  title: string;
  forms_no: number;
}

const Collections = () => {

  const { user } = useAuth()

  const [collections, setCollections] = useState<CollectionsType[]>([])

  let [prompt, setPrompt] = useState(false)

  const getCollections = async () => {
    try{
      const response = await fetch('/api/collections', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.uid
        })
      })
      let data = await response.json()
      console.log(data)
      setCollections(data)
    } catch(error){
      console.error(error)
    }
  }

  const createCollection = async (name : string) => {
   try {
    await fetch('/api/collections/create', {
      method: 'POST',
      body: JSON.stringify({
        userId: user?.uid,
        title: name
      })
    })
    getCollections()
   } catch(error){
     console.error(error) 
   }
  }

  const deleteCollection = async (id: string) => {
    const hasConfirmed = confirm("Are you sure you want to delete this collection?")
    if(hasConfirmed){
      try{
        await fetch(`/api/collections/delete/${id}`)
        getCollections()
      } catch(error){
        console.error(error)
      }
    }
  }

  const updateCollection = async (id: string, name: string) => {
    try{
      await fetch(`/api/collections/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: name
        })
      })
      getCollections()
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    getCollections()
  }, [])

  return (
    <section>
      <div className="container">
        <h1>Collections</h1>
        <button className="btn btn-main" onClick={() => setPrompt((prev) => !prev)}>New collection</button>

         {prompt ? <CreatePrompt setPrompt={setPrompt} createCollection={createCollection} /> : null }

        <div className={css.collections}>

          {collections.map(data => (
            <Collection key={data.id} data={data} deleteCollection={deleteCollection} updateCollection={updateCollection} />
          ))}

        </div>

      </div>
    </section>
  )
}

export default Collections