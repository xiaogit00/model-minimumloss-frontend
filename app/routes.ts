import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route(":modelSlug/definition", "routes/model-definition.tsx"),
    route(":modelSlug/dataset", "routes/dataset.tsx"),
    route(":modelSlug/training-code", "routes/training-code.tsx"),
    route(":modelSlug/eval-results", "routes/eval-results.tsx"),
    route(":modelSlug/image-classifier", "routes/image-classifier.tsx"),
] satisfies RouteConfig;
