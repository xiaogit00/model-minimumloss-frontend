export default function TableRow({ model }) {
    const date = new Date(model.created_at)

  return (
    <tr className="">
      <td>{date.toLocaleDateString()}</td>
      <td>{model.name}</td>
      <td>{model.description}</td>
      <td>{model.dataset_description} | <a href={model.dataset_link}>Link</a></td>
      <td>Training Code: {model.training_code_link}</td>
      <td>Eval Results</td>
    </tr>
  )
}