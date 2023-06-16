import css from "@styles/creation.module.scss"
import ScreenBox from "./ScreenBox"

const LeftMenu = () => {
  return (
    <div className={css.left_menu}>
      <div className={css.main_screens}>

        <div className={css.heading}>
          <span>Main screens</span>
          <button className="btn btn-gray">+</button>
        </div>
        
        <div className={css.screen_wrapper}>

          <ScreenBox /><ScreenBox /><ScreenBox />

        </div>

      </div>

      <div className={css.final_screens}>

        <div className={css.heading}>
          <span>Final screens</span>
          <button className="btn btn-gray">+</button>
        </div>
        
        <div className={css.screen_wrapper}>

          <ScreenBox /><ScreenBox /><ScreenBox />

        </div>
        
      </div>
    </div>
  )
}

export default LeftMenu