import { indexToLabel } from "@utils/indexToLabel";

type Props = {
  content: string;
  index: number;
  toggleSelectedAnswer?: (label: string) => void;
  selected?: boolean;
  isResultSelected?: boolean;
  isCorrectAnswer?: boolean;
}

const AnswerBox = ({
  content, 
  index, 
  selected, 
  toggleSelectedAnswer,
  isResultSelected,
  isCorrectAnswer,
}: Props) => {

  const classes = 'answer-box' +
                  (toggleSelectedAnswer ? (selected ? ' --pointer --selected' : ' --pointer') : '') +
                  (isResultSelected ? ' result-box--selected' : ' result-box') +
                  (isCorrectAnswer ? ' result-box--correct' : '');

  return (
    <div 
      className={classes}
      onClick={ toggleSelectedAnswer 
        ?  () => toggleSelectedAnswer( indexToLabel(index) )
        : undefined
      }
    >
      <span 
        className="answer-box-label"
        style={
          isCorrectAnswer ? { background: "#65E6CF" } 
          : isResultSelected ? { background: "#6586E6" } 
          : { background: "#dedede"}
        }
      >
        {indexToLabel(index)}
      </span>
      <span className="answer-box-content">{content}</span>
    </div>
  )
}

export default AnswerBox