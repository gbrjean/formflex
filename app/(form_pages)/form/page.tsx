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

  const [screens, setScreens] = useState<MainScreen[]>([
    { 
      description: "main screen 1",
      questions_type: 'aandsand2h41hsadhsaddsda',
      question_type_name: 'Multiple answers',
      data: {
        answers: [
          {
            content: "just an answer",
          },
          {
            content: "just an answer",
          },
          {
            content: "just an answer",
          },
        ],
        correct_answers: ["A", "B"],
      },
      title: 'un titlu',
      allowed_image: false,
    },
    { 
      description: "main screen 2",
      questions_type: 'aandsand2h41hsadhsaddsda',
      question_type_name: 'Multiple answers',
      data: {
        answers: [
          {
            content: "just an answer",
          },
          {
            content: "just an answer",
          },
        ],
        correct_answers: ["A", "B"],
      },
      title: 'un titlu',
      allowed_image: false,
    },
    { 
      description: "main screen 3",
      questions_type: 'aandsand2h41hsadhsaddsda',
      question_type_name: 'Multiple answers',
      data: {
        answers: [
          {
            content: "just an answer",
          },
          {
            content: "just an answer",
          },
          {
            content: "just an answer",
          },
        ],
        correct_answers: ["A", "B"],
      },
      title: 'un titlu',
      allowed_image: false,
    },
  ])
  const [finalScreens, setFinalScreens] = useState<FinalScreen[]>([
    {
      description: "final screen 1",
      title: "un titlu",
      score: "",
      allowed_image: false,
    },
  ])
  const [activeScreen, setActiveScreen] = useState(0)

  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>([])
  const [error, setError] = useState(false)

  const [final, setFinal] = useState<FinalScreen | null>(null)


  const fetchForm = async () => {
    try{
      const response = await fetch(`/api/form/${formId}`)
      let data = await response.json()
      console.log(data)
      if(!data){
        router.push('/404')
      }
      setData(data)
      setScreens(data.main_screens)
      setFinalScreens(data.final_screens)
      setSelectedAnswers(screens.map(() => []));

    } catch(error){
      console.error(error)
    }
  }

  const saveFormCompletion = async (score?: number) => {
    try {
      const reqBody: {
        id: string | null;
        email: string;
        fullname: string;
        answers: string[][];
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

      await fetch('/api/result/create', {
        method: 'POST',
        body: JSON.stringify(reqBody)
      })

     } catch(error){
       console.error(error) 
     }
  }

  //! DELETE, ONLY FOR DUMMY DATA
  useEffect(() => {
    console.log(screens)
    setSelectedAnswers(screens.map(() => []));
  }, [])

  useEffect(() => {
    console.log(screens[activeScreen], activeScreen)
  }, [activeScreen])
  
  //!
  

  // useEffect(() => {
  //   fetchForm()
  // }, [])

  useEffect(() => {
    if(error && selectedAnswers[activeScreen].length > 0){
      setError(false)
    }
  }, [selectedAnswers])

  useEffect(() => {
    console.log(userData.errors.email, userData.errors.fullname)
  }, [userData])
  


  const calculateScorePoints = () => {
    let score = 0;

    screens.forEach((screen, index) => {
      selectedAnswers[index].forEach((label, pos) => {
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
        if(selectedAnswers[activeScreen].length > 0){
          setActiveScreen(prevI => prevI+1)
        } else {
          setError(true)
        }
      } else {
        setActiveScreen(prevI => prevI+1)
      }
      
    } else if(action == "next" && !screens[activeScreen+1]){
      if(selectedAnswers[activeScreen].length > 0){
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

      setSelectedAnswers(prevSelectedAnswers => {
        return prevSelectedAnswers.map((array, index) => {
          if (index === activeScreen) {
            if (array.includes(label)) {
              return array.filter(item => item !== label);
            } else {
              return [...array, label];
            }
          }
          return array;
        });
      });

    } else {
      setSelectedAnswers(prevSelectedAnswers => {
        return prevSelectedAnswers.map((array, index) => {
          if (index === activeScreen) {
            return [label];
          }
          return array;
        });
      });
    }
  }
  

  return (
    <section className="fullscreen">
      <div className="container container-gray">
        
        <div className="form-canvas-wrapper">
          <div className="form-canvas">
            <div className={`form-canvas-content ${data?.color_palette}`}>
              <>

              { showUserdataScreen ? (
                <>
                <textarea value="Please complete your personal informations to proceed."></textarea>

                <div className="input-group">
                  <div className="input">
                    <span>Full name</span>
                    <input type="text" name="fullname" placeholder="John Doe" value={userData.fullname} onChange={changeUserdataInput} />
                  </div>
                  {userData.errors.fullname && <p className="error">This field is required</p>}
                </div>
                <div className="input-group">
                  <div className="input">
                    <span>E-mail</span>
                    <input type="text" name="email" placeholder="john.doe@gmail.com" value={userData.email} onChange={changeUserdataInput} />
                  </div>
                  {userData.errors.email && <p className="error">This field is required</p>}
                </div>
                </>
              ) : (

                final !== null ? (
                  <>
                  {final?.image != "" && <img src={final?.image} alt="" />}
                  <textarea disabled value={final?.description}></textarea>
                  </>
                ) : (
                  <>
                  {screens[activeScreen]?.image != "" && <img src={screens[activeScreen]?.image} alt="" />}
                  <textarea value={screens[activeScreen]?.description}></textarea>
                  
                  { screens[activeScreen]?.data?.answers.length > 0 &&
                      <div className="answer-box-wrapper">
                        {screens[activeScreen].data.answers.map((answer: Answer, index: number) => (
                          <AnswerBox 
                            key={index}
                            index={index} 
                            content={answer.content} 
                            selected={selectedAnswers[activeScreen]?.includes( indexToLabel(index) ) ? true : false}
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
  )
}

export default Form