import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route(":modelSlug/definition", "routes/model-definition.tsx")

] satisfies RouteConfig;
