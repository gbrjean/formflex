import css from "@styles/creation.module.scss"

interface HeaderProps {
  currentPanel: number,
  setPanel: React.Dispatch<React.SetStateAction<number>>;
}

const Header = ({currentPanel, setPanel} : HeaderProps) => {
  return (
    <div className={css.navbar_wrapper}>
      <div className={`container ${css.navbar}`}>
        <div className={css.title}>
          <span className={css.collection}>Ascelent Collection - </span>
          <span className={css.form}>Lead Qualification Form</span>
        </div>
        <ul className={css.nav}>
          <li className={css.nav_element}>Type</li>
          <li className={`${css.nav_element} ${css.active}`}>Create</li>
          <li className={css.nav_element}>Preview</li>
        </ul>
        <div className={css.actions}>
          <button className="btn btn-gray" onClick={() => currentPanel != 1 ? setPanel(currentPanel-1) : setPanel(1)}>Back</button>
          <button className="btn btn-black">Preview</button>
        </div>
      </div>
    </div>
  )
}

export default Header