export default function TableRow({ model }) {
    const date = new Date(model.created_at)
  return (
    <tr className="">
      <td className="w-1/12">#00{model.id}</td>
      <td className="w-1/12">{date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
})}</td>

      {/* MODEL NAME */}
      <td className="w-1/4 truncate px-2">
        {model.name} {model.reflections_url ? (
          <a className='text-gray-700' href={model.reflections_url}
          target="_blank" rel="noopener noreferrer">(Thoughts)</a>
      ) : ""}</td>
      
      {/* MODEL DEFINITION */}
      <td className="w-2/12 px-4">| Model: 
        <a className='text-gray-700' 
          href={model.slug + '/definition'}>
            {model.model_architecture}
        </a> 
      </td>
      
      <td className="w-1/12">| <a className='text-gray-700' href={model.dataset_link} target="_blank" rel="noopener noreferrer">
        Dataset
      </a></td>
      
      <td className="w-2/12 ">| <a className='text-gray-700' href={model.training_code_link} target="_blank" rel="noopener noreferrer" >Training Code </a></td>
      <td className="w-1/12">| Eval Results</td>
      <td className="w-2/12 truncate pl-16">Tags: CNN, ShallowNN</td>
    </tr>
  )
}