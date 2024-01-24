"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@context/AuthContext';

import { Form } from "@components/Form"
import css from "@styles/forms.module.scss"
import { redirect } from 'next/navigation';

type FormsType = {
  id: string;
  title: string;
  type: string;
  questions_no: number;
  completions: number;
  views: number;
  mid_completions_exits: number;
  exits: number;
}

type DraftsType = {
  id: string;
  title: string;
  type: string;
  questions_no: number;
}

type DataType = FormsType & {
  completion_rate: number;
  exits_rate: number;
  mid_completion_exits_rate: number;
};

const Forms = () => {

  const { user } = useAuth()

  if(!user) redirect('/login')

  const [forms, setForms] = useState<DataType[]>([])
  const [drafts, setDrafts] = useState<DraftsType[]>([])

  const [isDraftsMode, setIsDraftsMode] = useState(false)

  const getForms = async () => {
    try{
      const response = await fetch('/api/forms', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.uid
        })
      })
      let data = await response.json()
      console.log(data)
      const formsWithRates = data.map((form: FormsType) => calculateRates(form))
      setForms(formsWithRates)
    } catch(error){
      console.error(error)
    }
  }

  const getDrafts = async () => {
    try{
      const response = await fetch('/api/drafts', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.uid
        })
      })
      let data = await response.json()
      console.log(data)
      setDrafts(data)
    } catch(error){
      console.error(error)
    }
  }

  const calculateRates = (form: FormsType): DataType => {
    const completion_rate = form.completions ? Math.round((form.views / form.completions) * 100) : 0;
    const exits_rate = form.views ? Math.round((form.exits / form.views) * 100) : 0;
    const mid_completion_exits_rate = form.views ? Math.round((form.mid_completions_exits / form.views) * 100) : 0;
  
    return {
      ...form,
      completion_rate,
      exits_rate,
      mid_completion_exits_rate
    }
  }

  const deleteForm = async (id: string) => {
    const hasConfirmed = confirm("Are you sure you want to delete this form?")
    if(hasConfirmed){
      try{
        await fetch(`/api/forms/delete/${id}`)
        getForms()
      } catch(error){
        console.error(error)
      }
    }
  }

  const deleteDraft = async (id: string) => {
    const hasConfirmed = confirm("Are you sure you want to delete this draft?")
    if(hasConfirmed){
      try{
        await fetch(`/api/drafts/delete/${id}`)
        getDrafts()
      } catch(error){
        console.error(error)
      }
    }
  }

  useEffect(() => {
    getForms()
  }, [])

  useEffect(() => {
    if(isDraftsMode && drafts.length === 0){
      getDrafts()
    }
  }, [isDraftsMode])
  

  return (
    <section>
      <div className="container">
        <h1>{isDraftsMode ? 'Drafts' : 'Forms'}</h1>
        <div className="header-cta-group">
          <button className="btn btn-main">New form</button>
          <button className="btn btn-gray" onClick={() => setIsDraftsMode(prev => !prev)}>{`Show only ${isDraftsMode ? 'Forms' : 'Drafts'}`}</button>
        </div>

        <div className={css.forms}>

          { !isDraftsMode ? ( 
            forms.map(data => (
              <Form key={data.id} data={data} deleteForm={deleteForm} />
            ))
          ) : (
            drafts.map(data => (
              <Form key={data.id} data={data} deleteForm={deleteDraft} isDraft />
            ))
          )}

        </div>

      </div>
    </section>
  )
}

export default Forms