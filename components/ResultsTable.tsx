import css from "@styles/results.module.scss"

export const ResultsTable = ({
  results, deleteResult, showResult
} : {
  results: Result[];
  deleteResult: (id: string) => void;
  showResult: React.Dispatch<React.SetStateAction<number | undefined>>
}) => {
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

        { results.map((result, index) => (
          <tr key={result.id}>
            <td data-label="E-mail">{result.email}</td>
            <td data-label="Completed at">{result.completed_at}</td>
            <td data-label="Score">{result.score ? result.score : 'no'} points</td>
            <td className={css.actions}>
              <button className="btn btn-blue" onClick={() => showResult(index)}>View</button>
              <button className="btn btn-red" onClick={() => deleteResult(result.id)}>Delete</button>
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}
