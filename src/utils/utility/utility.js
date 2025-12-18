// export const matchRouteAndParamsFun = (routePath, reqPath) => {
//   const routeParts = routePath.replace(/\/+$/, "").split("/").filter(Boolean);
//   const reqParts = reqPath.replace(/\/+$/, "").split("/").filter(Boolean);

//   if (reqParts.length !== routeParts) return null;

//   const params = {};

//   for (let i = 0; i < routeParts.length; i++) {
//     if (routeParts[i].startsWith(":")) {
//       const key = routeParts[i].slice(1);
//       params[key] = reqParts[i];
//     } else if (routeParts[i].trim() !== reqParts[i].trim()) {
//       return null;
//     }
//   }
//   return params;
// };

export function matchRouteAndParamsFun(routePath, requestPath) {
  const routeParts = routePath.replace(/\/+$/, "").split("/").filter(Boolean);
  const reqParts = requestPath.replace(/\/+$/, "").split("/").filter(Boolean);

  if (routeParts.length !== reqParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(":")) {
      params[routeParts[i].slice(1)] = reqParts[i];
    } else if (routeParts[i].trim() !== reqParts[i].trim()) {
      return null;
    }
  }
  return params;
}
