export default function TableRow({ model }) {
    const date = new Date(model.created_at)

  return (
    <tr className="">
      <td className="w-1/12">#00{model.id}</td>
      <td className="w-1/12">{date.toLocaleDateString()}</td>

      <td className="w-1/4 truncate px-2">
        {model.name} (
          <a className='text-gray-700' href='https://www.example.com'
          target="_blank" rel="noopener noreferrer">Thoughts</a>
      )</td>
      
      <td className="w-2/12 px-4">| Model: 
        <a className='text-gray-700' 
          href={model.dataset_link} target="_blank" rel="noopener noreferrer">
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