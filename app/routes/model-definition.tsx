// provides type safety/inference
import type { Route } from "./+types/team";
import { useShikiHighlighter } from "react-shiki";




export async function loader({ params }: Route.LoaderArgs) {
  let modelData = await fetch('http://127.0.0.1:8000/models/' + params.modelSlug);
  return modelData;
}

export default function ModelDefinition({
  loaderData,
}: Route.ComponentProps) {
    const {description, model_architecture, model_code}  = loaderData[0]
    const highlightedCode = useShikiHighlighter(model_code, 'python', "catppuccin-latte");
  return (
    <div className="outer-container">
      <div className="text-2xl mb-4">{model_architecture}</div>
      <div className="flex flex-row justify-between">
        <div className="w-2/5 pr-4 whitespace-pre-wrap">
            {description}
        </div>
        <div className="w-3/5 overflow-x-auto"> <div className="code-block">{highlightedCode}</div></div>

      </div>
    </div>
  );
}

