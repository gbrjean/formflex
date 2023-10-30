import Link from "next/link"
import css from "@styles/forms.module.scss"

type DataType = {
  id: string;
  title: string;
  type: string;
  questions_no: number;
  completions: number;
  views: number;
  mid_completions_exits: number;
  exits: number;
  completion_rate: number;
  exits_rate: number;
  mid_completion_exits_rate: number;
}

type FormProps = {
  data: DataType;
  deleteForm: (id: string) => void;
}

export const Form = ({data, deleteForm} : FormProps) => {
  return (
    <div className={css.form}>
      <div className={css.form_heading}>
        <span className={css.form_title}>{data.title}</span>
        <span className={`dot ${css.dot}`}></span>
        <div>
          <span className={css.form_type}>{data.type}</span>
          <span className="dot"></span>
          <div className={css.form_questions}>{data.questions_no} questions</div>
        </div>
      </div>
      <div className={css.form_body}>
        <div className={css.form_stats}>
          <span>{data.completions} completions</span>
          <span>{data.views} views</span>
          <span>{data.mid_completions_exits} mid-completion exits</span>
          <span>{data.completion_rate}% completion rate</span>
          <span>{data.exits_rate}% exit rate</span>
          <span>{data.mid_completion_exits_rate}% mid-completion exits rate</span>
        </div>
        <div className={css.form_ctas}>
          <button className="btn btn-red" onClick={() => deleteForm(data.id)}>Delete</button>
          <Link href={`edit/form?id=${data.id}`} className="btn btn-blue">Modify</Link>
          <Link href={`form/details?id=${data.id}`} className="btn btn-green">Results</Link>
        </div>
      </div>
    </div>
  )
}
