import { ResultsTable } from "@components/ResultsTable"
import css from "@styles/results.module.scss"

const Results = () => {
  return (
    <section>
      <div className="container">

        <div className={css.info}>
          <span>Results - </span> <span>Lead Qualification Form</span>
        </div>

        <ResultsTable />

      </div>
    </section>
  )
}

export default Results