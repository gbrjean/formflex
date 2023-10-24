import { indexToLabel } from "@utils/indexToLabel";

type Props = {
  content: string;
  index: number;
  toggleSelectedAnswer?: (label: string) => void;
  selected?: boolean;
}

const AnswerBox = ({content, index, selected, toggleSelectedAnswer}: Props) => {

  return (
    <div 
      className={ 
        toggleSelectedAnswer
          ? selected 
              ? "answer-box --pointer --selected"
              : "answer-box --pointer"
          : "answer-box"
      }
      onClick={ toggleSelectedAnswer 
        ?  () => toggleSelectedAnswer( indexToLabel(index) )
        : undefined
      }
    >
      <span className="answer-box-label">{indexToLabel(index)}</span>
      <span className="answer-box-content">{content}</span>
    </div>
  )
}

export default AnswerBox