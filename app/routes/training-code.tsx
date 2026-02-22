// provides type safety/inference
import type { Route } from "./+types/team";
import { useShikiHighlighter } from "react-shiki";
import { API_BASE_URL } from '~/config';




export async function loader({ params }: Route.LoaderArgs) {
  let training_code_data = await fetch(`${API_BASE_URL}/models/${params.modelSlug}/training-code`);
  return training_code_data;
}

export default function TrainingCode({
  loaderData,
}: Route.ComponentProps) {
    const training_code = loaderData
    const highlightedCode = useShikiHighlighter(training_code, 'python', "catppuccin-latte");
  return (
    <div className="outer-container ">
      <div className="text-2xl mb-4 "></div>
      <div className="overflow-x-auto"> <div className="code-block">{highlightedCode}</div></div>
    </div>
  );
}

