import css from "@styles/forms.module.scss"

export const Form = () => {
  return (
    <div className={css.form}>
      <div className={css.form_heading}>
        <span className={css.form_title}>Client aquisition form</span>
        <span className={`dot ${css.dot}`}></span>
        <div>
          <span className={css.form_type}>Some form type</span>
          <span className="dot"></span>
          <div className={css.form_questions}>14 questions</div>
        </div>
      </div>
      <div className={css.form_body}>
        <div className={css.form_stats}>
          <span>200 completions</span>
          <span>514 views</span>
          <span>35 mid-completion exits</span>
          <span>48% completion rate</span>
          <span>52% exit rate</span>
          <span>12% mid-completion exits rate</span>
        </div>
        <div className={css.form_ctas}>
        <button className="btn btn-red">Delete</button>
        <button className="btn btn-blue">Modify</button>
        <button className="btn btn-green">Results</button>
        </div>
      </div>
    </div>
  )
}
