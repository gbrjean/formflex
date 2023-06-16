import css from "@styles/creation.module.scss"

interface TypePanelProps {
  setPanel: React.Dispatch<React.SetStateAction<number>>;
}

const TypePanel = ({setPanel} : TypePanelProps) => {


  return (
    <div className={css.type_panel}>
      <div className={css.wrapper}>
        <span className={css.title}>Initial setup</span>

        <div className={css.form}>
          <div className={css.form_input}>
            <label htmlFor="name">Form name</label>
            <input type="text" id="name" autoComplete="new-form" />
          </div>
          <div className={css.form_input}>
            <label htmlFor="type">Form type</label>
            <input type="text" id="type" autoComplete="new-type" />
          </div>
          <div className={css.form_input}>
            <label htmlFor="collection">Collection</label>
            <select name="collection" id="collection">
              <option value="id1">Lead</option>
              <option value="id2">Poll</option>
              <option value="id3">Survey</option>
            </select>
          </div>
        </div>

        <div className={css.actions}>
          <button className="btn btn-main" onClick={() => setPanel(2)}>Create</button>
          <button className="btn btn-gray">Back</button>
        </div>

      </div>
    </div>
  )
}

export default TypePanel