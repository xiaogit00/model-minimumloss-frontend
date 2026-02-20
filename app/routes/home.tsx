import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import TableRow from "~/components/TableRow";
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Models | MinimumLoss" },
    { name: "description", content: "A home for all the models that I've trained"},
  ];
}

export default function Home() {

  async function fetchModels() {
    const res = await fetch('http://127.0.0.1:8000/models');
    return res.json();
  }
    const { data, isLoading, error } = useQuery({
      queryKey: ["modelsData"],
      queryFn: fetchModels,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;
    console.log(data)

  return (
    <div className="outer-container">
      <table className="table-fixed w-full border-separate border-spacing-y-2">
        <tbody>
          {data?.map((model) => (
            <TableRow key={model.slug} model={model} />
          ))}
        </tbody>
      </table>

    </div>
  );
}
