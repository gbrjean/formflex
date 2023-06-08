import css from "@styles/collections.module.scss"

export const Collection = () => {
  return (
    <div className={css.collection}>
      <span className={css.collection_title}>My marketing funnel</span>
      <div className={css.collection_data}>
        <span>3 forms</span>
        <button className="btn btn-black">+</button>
      </div>
    </div>
  )
}
