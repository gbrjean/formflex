import css from "@styles/results.module.scss"

export const ResultsTable = () => {
  return (
    <table className={css.table}>
      <thead>
        <tr>
          <th>E-mail</th>
          <th>Completed at</th>
          <th>Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="E-mail">marcel2001@yahoo.com</td>
          <td data-label="Completed at">04/01/2023</td>
          <td data-label="Score">70 points</td>
          <td className={css.actions}>
            <button className="btn btn-blue">View</button>
            <button className="btn btn-red">Delete</button>
          </td>
        </tr>

        <tr>
          <td data-label="E-mail">aurelioan@gmail.com</td>
          <td data-label="Completed at">04/01/2023</td>
          <td data-label="Score">100 points</td>
          <td className={css.actions}>
            <button className="btn btn-blue">View</button>
            <button className="btn btn-red">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
