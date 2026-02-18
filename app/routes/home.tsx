import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import TableRow from "~/components/TableRow";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



export default function Home() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchModels()
  }, [])

    const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/models');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setModels(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading m-8">Loading models...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="outer-container">
      <table className="table-fixed w-full border-separate border-spacing-y-2">
        <tbody>
          {models.map(model => (
            <TableRow key={model.slug} model={model} />
          ))}
        </tbody>
      </table>

    </div>
  );
}
