import { Collection } from "@components/Collection"
import css from "@styles/collections.module.scss"

const Collections = () => {
  return (
    <section>
      <div className="container">
        <h1>Collections</h1>
        <button className="btn btn-main">New collection</button>

        <div className={css.collections}>

          <Collection />


        </div>

      </div>
    </section>
  )
}

export default Collections