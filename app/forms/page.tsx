import { Form } from "@components/Form"
import css from "@styles/forms.module.scss"

const Forms = () => {
  return (
    <section>
      <div className="container">
        <h1>Forms</h1>
        <button className="btn btn-main">New form</button>

        <div className={css.forms}>

          <Form />

        </div>

      </div>
    </section>
  )
}

export default Forms