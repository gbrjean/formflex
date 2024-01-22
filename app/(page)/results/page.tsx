"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@context/AuthContext';
import { ResultsTable } from "@components/ResultsTable"
import css from "@styles/results.module.scss"
import { useEffect, useState } from 'react';
import ResultsPopup from '@components/ResultsPopup';


const Results = () => {

  const { user } = useAuth()

  const router = useRouter()

  const searchParams = useSearchParams()
  const formId = searchParams.get('id')

  if(!formId){
    router.push('/')
  }

  const [title, setTitle] = useState<string | null>(null)
  const [results, setResults] = useState<Result[]>([])

  const [showPopup, setShowPopup] = useState(false)
  const [resultIndex, setResultIndex] = useState<number | undefined>(undefined)


  const getFormData =  async () => {
    try{
      const response = await fetch('/api/result', {
        method: 'POST',
        body: JSON.stringify({
          formId,
          userId: user?.uid
        })
      })
      if(!response.ok){
        router.push('/')
      }
      let data = await response.json()
      console.log(data)
      setTitle(data.title)
      setResults(data.results)
    } catch(error){
      console.error(error)
    }
  }

  const deleteResult = async (id: string) => {
    try{
      await fetch(`/api/result/delete/${id}`)
    } catch(error){
      console.error(error)
    }
  }


  useEffect(() => {
    getFormData()
  }, [])
  
  useEffect(() => {
    if(results.length > 0 && resultIndex !== undefined){
      setShowPopup(true)
    }
  }, [resultIndex])
  

  return (
    <section>
      <div className="container">

        <div className={css.info}>
          <span>Results - </span> <span>{title || 'Loading...'}</span>
        </div>

        { !results || results.length === 0 ? (
          <span>No form completions so far.</span>
        ) : (
          <ResultsTable results={results} deleteResult={deleteResult} showResult={setResultIndex} />
        )}

        { (showPopup && resultIndex !== undefined) && 
          <ResultsPopup result={results[resultIndex]} showPopup={showPopup} setShowPopup={setShowPopup} showResult={setResultIndex} />
        }

      </div>
    </section>
  )
}

export default Results