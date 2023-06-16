import css from "@styles/creation.module.scss"
import TrashIcon from "@public/assets/icons/TrashIcon"
import OrderIcon from "@public/assets/icons/OrderIcon"

const ScreenBox = () => {
  return (
    <div className={css.screen}>
      <div className={css.screen_icon}></div>
      <p className={css.screen_title}>
        Interesat de serviciile noaastre? Raspunde la cateva intrebari simple si interesante
      </p>
      <div className={css.screen_actions}>
        <TrashIcon />
        <OrderIcon />
      </div>
    </div>
  )
}

export default ScreenBox