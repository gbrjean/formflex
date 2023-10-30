"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from "@public/assets/icons/ArrowLeft"
import AnswerBox from "@components/AnswerBox"
import { indexToLabel } from "@utils/indexToLabel"
import { isEmptyString } from "@utils/isEmptyString"


type UserData = {
  email: string;
  fullname: string;
  errors: {
    email: boolean;
    fullname: boolean;
  }
}

const Form = () => {

  const router = useRouter()

  const searchParams = useSearchParams()
  const formId = searchParams.get('id')

  if(!formId){
    router.push('/404')
  }

  const [data, setData] = useState<{id: string; score_points: boolean; color_palette: string} | null>(null)

  const [userData, setUserData] = useState<UserData>({
    email: "",
    fullname: "",
    errors: {
      email: false,
      fullname: false
    }
  })

  const [showUserdataScreen, setShowUserdataScreen] = useState(true)

  const [screens, setScreens] = useState<MainScreen[]>([])
  const [finalScreens, setFinalScreens] = useState<FinalScreen[]>([])
  const [activeScreen, setActiveScreen] = useState(0)

  const [selectedAnswers, setSelectedAnswers] = useState<{selected_answers: string[]}[]>([]);
  const [error, setError] = useState(false)

  const [final, setFinal] = useState<FinalScreen | null>(null)


  const fetchForm = async () => {
    try{
      const response = await fetch(`/api/form/${formId}`)
      if(!response.ok){
        router.push('/404')
      }
      let data = await response.json()
      console.log(data)
      if(!data){
        router.push('/404')
      }
      setData(data)
      setScreens(data.main_screens)
      setFinalScreens(data.final_screens)

    } catch(error){
      console.error(error)
    }
  }

  const [hasSetSelectedAnswers, setHasSetSelectedAnswers] = useState(false)

  useEffect(() => {
    if (!hasSetSelectedAnswers && screens.length > 0) {
      setSelectedAnswers(screens.map(() => ({ selected_answers: [] })))
      setHasSetSelectedAnswers(true)
    }
  }, [screens, hasSetSelectedAnswers]);


  const saveFormCompletion = async (score?: number) => {
    try {
      const reqBody: {
        id: string | null;
        email: string;
        fullname: string;
        answers: {selected_answers: string[]}[];
        score?: number;
      } = {
        id: formId,
        email: userData.email,
        fullname: userData.fullname,
        answers: selectedAnswers,
      };
  
      if (score !== undefined) {
        reqBody.score = score;
      }
      console.log(reqBody)
      await fetch('/api/result/create', {
        method: 'POST',
        body: JSON.stringify(reqBody)
      })

     } catch(error){
       console.error(error) 
     }
  }


  useEffect(() => {
    console.log(activeScreen)
  }, [activeScreen])

  useEffect(() => {
    console.log(selectedAnswers)
  }, [selectedAnswers])

  

  useEffect(() => {
    fetchForm()
  }, [])

  useEffect(() => {
    if(error && selectedAnswers[activeScreen].selected_answers.length > 0){
      setError(false)
    }
  }, [selectedAnswers])



  const calculateScorePoints = () => {
    let score = 0;

    screens.forEach((screen, index) => {
      selectedAnswers[index].selected_answers.forEach((label, pos) => {
        // if(pos > index){
        //   return score
        // }
        if(screen.data.correct_answers.includes(label)){
          score += Number(screen.data.answers[pos].points)
        }
      })
    })

    return score
  }
  
  const handleScreenChange = (action: string) => {
    if(action == "next" && showUserdataScreen) {
      if(isEmptyString(userData.email)){
        setUserData(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            email: true
          }
        }))
      } else if(userData.errors.email){
        setUserData(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            email: false
          }
        }))
      }
      if(isEmptyString(userData.fullname)){
        setUserData(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            fullname: true
          }
        }))
      } else if(userData.errors.fullname){
        setUserData(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            fullname: false
          }
        }))
      }

      setUserData(prev => {
        if (!prev.errors.email && !prev.errors.fullname) {
          setShowUserdataScreen(false);
        }
        return prev; //? state is not changed, only checked
      });

    } else if(action == "next" && screens[activeScreen+1]){
      if(screens[activeScreen].question_type_name != "Text box"){
        if(selectedAnswers[activeScreen].selected_answers.length > 0){
          setActiveScreen(prevI => prevI+1)
        } else {
          setError(true)
        }
      } else {
        setActiveScreen(prevI => prevI+1)
      }
      
    } else if(action == "next" && !screens[activeScreen+1]){
      if(selectedAnswers[activeScreen].selected_answers.length > 0){
        if(data!.score_points && !final){
          const final_score = calculateScorePoints()
          console.log(final_score)
          finalScreens.map(screen => {
            if(final_score >= +screen.score){
              setFinal(screen)
              saveFormCompletion(final_score)
            }
          })

        } else if(!final) {
            setFinal(finalScreens[0])
            saveFormCompletion()
        }
      } else {
        setError(true)
      }
    }

    if(action == "prev" && activeScreen === 0){
      setShowUserdataScreen(true)
    } else if(action == "prev" && screens[activeScreen-1]) {
      setActiveScreen(prevI => prevI-1)
    }
  }

  const changeUserdataInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const toggleSelectedAnswer = (label: string) => {
    if (screens[activeScreen]?.question_type_name === "Multiple answers") {

      setSelectedAnswers((prevSelectedAnswers) =>
        prevSelectedAnswers.map((entry, index) => {
          if (index === activeScreen) {
            const selected_answers = entry.selected_answers.includes(label)
              ? entry.selected_answers.filter((item) => item !== label)
              : [...entry.selected_answers, label];
      
            return {
              ...entry,
              selected_answers,
            };
          }
          return entry;
        })
      );
    

    } else {
      setSelectedAnswers((prevSelectedAnswers) =>
        prevSelectedAnswers.map((entry, index) => {
          if (index === activeScreen) {
            return {
              ...entry,
              selected_answers: [label],
            };
          }
          return entry;
        })
      );
    }
  }
  

  return (
    <>
    { data && 
      <section className="fullscreen">
        <div className="container container-gray">
          
          <div className="form-canvas-wrapper">
            <div className="form-canvas">
              <div className={`form-canvas-content ${data?.color_palette}`}>
                <>

                { showUserdataScreen ? (
                  <>
                  <textarea defaultValue="Please complete your personal informations to proceed."></textarea>

                  <div className="input-group">
                    <div className="input">
                      <span>Full name</span>
                      <input type="text" name="fullname" className="border-color border-color-focused" placeholder="John Doe" value={userData.fullname} onChange={changeUserdataInput} />
                    </div>
                    {userData.errors.fullname && <p className="error">This field is required</p>}
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <span>E-mail</span>
                      <input type="text" name="email" className="border-color border-color-focused" placeholder="john.doe@gmail.com" value={userData.email} onChange={changeUserdataInput} />
                    </div>
                    {userData.errors.email && <p className="error">This field is required</p>}
                  </div>
                  </>
                ) : (

                  final !== null ? (
                    <>
                    {final?.image != "" && <img src={final?.image} alt="" />}
                    <textarea disabled defaultValue={final?.description}></textarea>
                    </>
                  ) : (
                    <>
                    {screens[activeScreen]?.image != "" && <img src={screens[activeScreen]?.image} alt="" />}
                    <textarea defaultValue={screens[activeScreen]?.description}></textarea>
                    
                    { screens[activeScreen]?.data?.answers.length > 0 &&
                        <div className="answer-box-wrapper">
                          {screens[activeScreen].data.answers.map((answer: Answer, index: number) => (
                            <AnswerBox 
                              key={index}
                              index={index} 
                              content={answer.content} 
                              selected={selectedAnswers[activeScreen]?.selected_answers.includes( indexToLabel(index) ) ? true : false}
                              toggleSelectedAnswer={toggleSelectedAnswer} 
                            />
                          ))}
                        </div>
                    }
                    </>
                  )

                )}
                
                
                  

                <div className="form-canvas-actions">
                  {!final ? (!showUserdataScreen && <button className="btn" onClick={() => handleScreenChange("prev")}><ArrowLeft /></button>) : null}
                  {!final && <button className="btn" onClick={() => handleScreenChange("next")}>Next</button>}
                  {error && <p className="error">Please choose an answer</p>}
                </div>

                </>
              </div>
            </div>
          </div>

        </div>
      </section>
    }
    </>
  )
}

export default Form