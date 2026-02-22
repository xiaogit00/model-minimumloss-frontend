// provides type safety/inference
import type { Route } from "./+types/team";
import { useShikiHighlighter } from "react-shiki";
import { useState } from "react";




export async function loader({ params }: Route.LoaderArgs) {
  const training_code_res = await fetch(
    `http://127.0.0.1:8000/models/${params.modelSlug}/eval-results`
  );

  const training_code_data = await training_code_res.text(); 

  return {
    training_code_data,
    loss_chart_url: `http://127.0.0.1:8000/models/${params.modelSlug}/loss-chart`,
    errors_chart_url: `http://127.0.0.1:8000/models/${params.modelSlug}/errors-chart`,
  };
}

export default function EvalResults({
  loaderData,
}: Route.ComponentProps) {
    const { training_code_data, loss_chart_url, errors_chart_url } = loaderData;
    const [lossImgError, setLossImgError] = useState(false);
    const [errorsImgError, seterrorsLossImgError] = useState(false);
    console.log(loss_chart_url)
    // const training_code_data = loaderData
    const highlightedCode = useShikiHighlighter(training_code_data, 'log', "catppuccin-latte");
  return (
    <div className="outer-container ">
      <div className="flex">
        <div className="w-1/2">
          {!lossImgError && (
            <img 
              src={loss_chart_url} 
              alt="Model Loss Chart" 
              onError={() => setLossImgError(true)}
            />
          )}
        </div>
        <div className="w-1/2">
          {!errorsImgError && (
            <img 
              src={errors_chart_url} 
              alt="Model Loss Chart" 
              onError={() => seterrorsLossImgError(true)}
            />
          )}
        </div>
      </div>
      <div className="text-2xl mb-4 "></div>
      <div className="overflow-x-auto"> <div className="code-block">{highlightedCode}</div></div>
    </div>
  );
}

