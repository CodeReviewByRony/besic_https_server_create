import https from "https";
import fs from "fs";
import path from "path";
import constants from "constants";
import { SSL_CERT_PATH, SSL_KEY_PATH } from "./constent.js";
import { userRoute } from "./routes/user.route.js";
import { matchRouteAndParamsFun } from "./utils/utility/utility.js";

if (!SSL_CERT_PATH || !SSL_KEY_PATH) {
  console.log("ssl path missing");
}

const sslOptions = {
  key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
  cert: fs.readFileSync(path.resolve(SSL_CERT_PATH)),
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.3",
  secureOptions:
    constants.SSL_OP_NO_SSLv3 |
    constants.SSL_OP_NO_TLSv1 |
    constants.SSL_OP_NO_TLSv1_1,
};

export const app = https.createServer(sslOptions, (req, res) => {
  // security headers and cors
  const securityHeaders = {
    // ===== Security Headers =====
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",

    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    "Content-Security-Policy": "default-src 'self'",

    "Referrer-Policy": "no-referrer",

    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",

    // ===== CORS =====
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",

    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { method, url } = req;
  const pathname = url.split("?")[0].replace(/\/+$/, "");

  //   preflight ............. request
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  //   define route..............

  // const allRoutes = [...userRoute];

  // let routeMatched = false;

  // for (const route of allRoutes) {
  //   if (method === route.method) {
  //     const params = matchRouteAndParamsFun(route.path, pathname);
  //     if (params !== null) {
  //       console.log("Route matched, calling controller");
  //       req.params = params;
  //       return route.handler(req, res);
  //     }
  //   }
  // }

  const allRoutes = [...userRoute];

  for (const route of allRoutes) {
    if (method === route.method) {
      const params = matchRouteAndParamsFun(route.path, pathname);

      if (params !== null) {
        // console.log("Route matched");

        req.params = params;

        // ✅ ONLY middleware check
        if (route.middlwere) {
          return route.middlwere(req, res, () => {
            route.handler(req, res);
          });
        }

        return route.handler(req, res);
      }
    }
  }

  if (!routeMatched) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "Route not found",
      })
    );
  }

  //   app create done
});
