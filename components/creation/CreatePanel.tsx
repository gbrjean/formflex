import LeftMenu from "@components/creation/LeftMenu"
import RightMenu from "@components/creation/RightMenu"
import css from "@styles/creation.module.scss"

const CreatePanel = () => {
  return (
    <div className={css.create_panel}>
      <LeftMenu />
      <div className={css.canvas_wrapper}>
        <div className={css.canvas}>

        </div>
      </div>
      <RightMenu />
    </div>
  )
}

export default CreatePanel