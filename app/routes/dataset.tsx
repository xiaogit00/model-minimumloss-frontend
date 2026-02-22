// provides type safety/inference
import type { Route } from "./+types/team";
import { useShikiHighlighter } from "react-shiki";
import Markdown from 'react-markdown'
import { API_BASE_URL } from '~/config';

const markdown = '# Hi, *Pluto*!'

export async function loader({ params }: Route.LoaderArgs) {
  let datasetData = await fetch(`${API_BASE_URL}/models/${params.modelSlug}/dataset`);
  return datasetData;
}

export default function ModelDefinition({
  loaderData,
}: Route.ComponentProps) {
    const dataset = loaderData
    // console.log(typeof(loaderData))
  return (
    <div className="outer-container">
      <div className="prose !max-w-none"><Markdown >{dataset}</Markdown></div>
    </div>
  );
}

