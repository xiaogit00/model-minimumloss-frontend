// provides type safety/inference
import type { Route } from "./+types/team";
import { useShikiHighlighter } from "react-shiki";




export async function loader({ params }: Route.LoaderArgs) {
  let training_code_data = await fetch('http://127.0.0.1:8000/models/' + params.modelSlug + "/eval-results");
  return training_code_data;
}

export default function EvalResults({
  loaderData,
}: Route.ComponentProps) {
    const evalResults = loaderData
    const highlightedCode = useShikiHighlighter(evalResults, 'log', "catppuccin-latte");
  return (
    <div className="outer-container ">
      <div className="text-2xl mb-4 "></div>
      <div className="overflow-x-auto"> <div className="code-block">{highlightedCode}</div></div>
    </div>
  );
}

