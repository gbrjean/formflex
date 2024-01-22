import css from "@styles/creation.module.scss"
import { CompletionTriggerKind } from "typescript";

interface HeaderProps {
  currentPanel: number,
  togglePanel: (index: number) => void;
  setup: {
    title: string;
    type_name: string;
    collection_id: string;
  };
  saveFormToForms: () => void;
  confirmExit: () => void;
}

const Header = ({currentPanel, togglePanel, setup, saveFormToForms, confirmExit} : HeaderProps) => {

  return (
    <div className={css.navbar_wrapper}>
      <div className={`container ${css.navbar}`}>
        <div className={css.title}>
          { currentPanel !== 1 && (
              <>
              <span className={css.collection}>{setup.title} - </span>
              <span className={css.form}>{setup.type_name}</span>
              </>
          )}
        </div>
        <ul className={css.nav}>
          <li className={currentPanel == 1 ? `${css.nav_element} ${css.active}` : `${css.nav_element}`} onClick={() => togglePanel(1)}>Type</li>
          <li className={currentPanel == 2 ? `${css.nav_element} ${css.active}` : `${css.nav_element}`} onClick={() => togglePanel(2)}>Create</li>
          <li className={currentPanel == 3 ? `${css.nav_element} ${css.active}` : `${css.nav_element}`} onClick={() => togglePanel(3)}>Preview</li>
        </ul>
        <div className={css.actions}>
          <button className="btn btn-gray" onClick={() => currentPanel !== 1 ? togglePanel(currentPanel-1) : confirmExit()}>Back</button>
          { currentPanel === 3
              ? <button className="btn btn-black" onClick={saveFormToForms}>Save</button>
              : <button className="btn btn-black" onClick={() => togglePanel(3)}>Preview</button>
          }
        </div>
      </div>
    </div>
  )
}

export default Header