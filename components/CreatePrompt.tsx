import { useState } from 'react'
import css from "@styles/creation.module.scss"

type CreatePromptProps = {
  setPrompt: (value: boolean) => void;
  createCollection: (name: string) => void;
};

const CreatePrompt: React.FC<CreatePromptProps> = ({setPrompt, createCollection}) => {

  let [name, setName] = useState("")

  return (
    <div className={`create-prompt-wrapper ${css.type_panel}`}>
      <div className={`create-prompt ${css.wrapper}`}>
        <h2>Create form</h2>

        <div className={css.form}>
          <div className={css.form_input}>
            <label htmlFor="name">Collection name</label>
            <input type="text" id="name" autoComplete="new-collection" onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className={css.actions}>
          <button className="btn btn-main" onClick={() => {createCollection(name); setPrompt(false)} } >Create</button>
          <button className="btn btn-gray" onClick={() => setPrompt(false)}>Back</button>
        </div>

      </div>
    </div>
  )
}

export default CreatePrompt