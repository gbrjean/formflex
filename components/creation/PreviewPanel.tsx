import AnswerBox from "@components/AnswerBox"
import { ArrowLeft } from "@public/assets/icons/ArrowLeft"
import css from "@styles/creation.module.scss"
import { indexToLabel } from "@utils/indexToLabel"
import { useEffect, useState } from "react"

type Props = {
  mainScreens: MainScreen[],
  finalScreens: FinalScreen[],
  State_score: boolean;
  State_color_palette: string;
}

const PreviewPanel = ({mainScreens, finalScreens, State_score, State_color_palette}: Props) => {

  const [screens, setScreens] = useState<MainScreen[]>([])
  const [activeScreen, setActiveScreen] = useState(0)

  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>([])
  const [error, setError] = useState(false)

  const [final, setFinal] = useState<FinalScreen | null>(null)

  useEffect(() => {
    setScreens(mainScreens)
    setSelectedAnswers(mainScreens.map(() => []));
  }, [])

  useEffect(() => {
    console.log(selectedAnswers)

    if(error && selectedAnswers[activeScreen].length > 0){
      setError(false)
    }
  }, [selectedAnswers])

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
    if(action == "next" && screens[activeScreen+1]){
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
        if(State_score && !final){
          const final_score = calculateScorePoints()
          console.log(final_score)
          finalScreens.map(screen => {
            if(final_score >= +screen.score){
              setFinal(screen)
            }
          })

        } else if(!final) {
            setFinal(finalScreens[0])
        }
      } else {
        setError(true)
      }
    }

    if(action == "prev" && final){
      setFinal(null)
      setActiveScreen(screens.length-1)
    } else if(action == "prev" && screens[activeScreen-1]) {
      setActiveScreen(prevI => prevI-1)
    }
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
    <div className={css.preview_panel}>
      <div className={css.canvas_wrapper}>
        <div className={css.canvas}>
          <div className={`${css.canvas_content} ${State_color_palette}`}>
            <>
            
            { final !== null ? (
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
                        index={index} 
                        content={answer.content} 
                        selected={selectedAnswers[activeScreen].includes( indexToLabel(index) ) ? true : false}
                        toggleSelectedAnswer={toggleSelectedAnswer} 
                      />
                    ))}
                  </div>
              }
              </>
            )}
              

            <div className={css.canvas_actions}>
              {activeScreen != 0 && <button className="btn foreground-bg foreground-bg-hover text-color" onClick={() => handleScreenChange("prev")}><ArrowLeft /></button>}
              {!final && <button className="btn foreground-bg foreground-bg-hover text-color" onClick={() => handleScreenChange("next")}>Next</button>}
              {error && <p className="error">Please choose an answer</p>}
            </div>

            </>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPanel