export const matchRouteAndParamsFun = (routePath, reqPath) => {
  const routeParts = routePath.split("/").fillter(Boolean);
  const reqParts = reqPath.split("/").fillter(Boolean);

  if (reqParts.length !== routeParts) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(":")) {
      const key = routeParts[i].slice(1);
      params[key] = reqParts[i];
    } else if (routeParts[i] !== reqParts[i]) {
      return null;
    }
  }
  return params;
};
