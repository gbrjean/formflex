import css from "@styles/results.module.scss"
import AnswerBox from "./AnswerBox"
import { useEffect, useRef } from "react";
import { indexToLabel } from "@utils/indexToLabel";

type Props = {
  result: Result;
  showPopup: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showResult: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const ResultsPopup = ({result, showPopup, setShowPopup, showResult}: Props) => {

  console.log(result)

  const childRef = useRef<HTMLDivElement | null>(null);

  const handleDocumentClick = (event: MouseEvent) => {
    if (childRef.current && !childRef.current.contains(event.target as Node)) {
      setShowPopup(false);
      showResult(undefined);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showPopup]);

  return (
    <div className={css.popup_wrapper}>
      <div className={css.popup} ref={childRef}>
        <span className={css.popup_title}>Results</span>

        <div className={css.popup_userdata}>
          <span>{result.email}</span>
          <div className="dot"></div>
          <span>{result.score ? result.score : 'no'} points</span>
        </div>

        <div className={css.popup_questions}>

          { result.screen_titles.map((title, index) => (
              <div className={css.popup_question}>
                <div className={css.popup_question_title}>
                  <span>Question {index+1}</span>
                  <span>{title}</span>
                </div>
                <span>Chosen answers:</span>

                <div className="answer-box-wrapper">
                  {result.screen_answers[index].answers.map((answer, labelIndex) => {
                    return (
                        <AnswerBox
                          key={labelIndex}
                          index={labelIndex}
                          content={answer.content}
                          isCorrectAnswer={result.screen_answers[index].correct_answers.includes(result.answers[index].selected_answers[labelIndex])}
                          isResultSelected={result.answers[index].selected_answers[labelIndex] === indexToLabel(labelIndex)}
                        />
                    )
                  })}
                </div>

              </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default ResultsPopup