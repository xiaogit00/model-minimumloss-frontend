export default function TableRow({ model }) {
  // [('1', 'MNISTFashion', 'shallowNN', '18FEB26'), ('2', 'MNISTFashion', 'deepNN', '21FEB26')]
    const modelId = model[0]
    const datasetName = model[1]
    const modelName = model[2]
    const dateStr = model[3];
    const modelSlug = model[4]
    // Parse the string: dd(18), mon(feb), yy(26)
    const day = parseInt(dateStr.substring(0, 2));
    const monthStr = dateStr.substring(2, 5);
    const year = 2000 + parseInt(dateStr.substring(5, 7)); // Converts '26' to 2026
    const months = {jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, 
                    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11};
    const month = months[monthStr.toLowerCase()];
    const dateObj = new Date(year, month, day);
  return (
    <tr className="">
      <td className="w-1/12">#00{modelId}</td>
      <td className="w-1/12">{dateObj.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
})}</td>

      {/* MODEL NAME */}
      <td className="w-1/4 truncate px-2">
        {datasetName + " " + modelName} {modelId ? (
          <a className='text-gray-700' href={modelId}
          target="_blank" rel="noopener noreferrer">(Thoughts)</a>
      ) : ""}</td>
      
      {/* MODEL DEFINITION */}
      <td className="w-2/12 px-4">| Model: 
        <a className='text-gray-700' 
          href={modelSlug + '/definition'}>
            {modelName}
        </a> 
      </td>
      
      <td className="w-1/12">| <a className='text-gray-700'>
        <a className='text-gray-700' 
          href={modelSlug + '/dataset'}>
            Dataset
        </a> 
      </a></td>
      
      <td className="w-2/12 ">| <a className='text-gray-700' href={modelSlug + "/training-code"}>Training Code </a></td>
      <td className="w-1/12">|<a className='text-gray-700' href={modelSlug + "/eval-results"}>Eval Results </a></td>
      <td className="w-2/12 truncate pl-16">Tags: CNN, ShallowNN</td>
    </tr>
  )
}