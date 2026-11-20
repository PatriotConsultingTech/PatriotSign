import logo from "../assets/images/logo.png";
import { getEnv } from "./Utils";
import { getRuntimeConfig } from "./runtimeConfig";
import { hasExplicitRuntimeConfig } from "./deploymentRuntime";

const runtimeConfig = getRuntimeConfig();

export function serverUrl_fn() {
  if (window?.__OPENSIGN_LOCAL_QA_IDENTITY__ === true) {
    return `${window.location.origin}/api/app`;
  }
  const env = getEnv();
  const runtimeConfig = getRuntimeConfig();
  if (
    hasExplicitRuntimeConfig() &&
    runtimeConfig.brandKey !== "opensign" &&
    !runtimeConfig.urls.api
  ) {
    return "";
  }
  const serverurl =
    runtimeConfig.urls.api ||
    (env?.REACT_APP_SERVERURL
      ? env.REACT_APP_SERVERURL // env.REACT_APP_SERVERURL is used for prod
      : process.env.REACT_APP_SERVERURL); // process.env.REACT_APP_SERVERURL is used for dev (locally)
  let baseUrl = serverurl ? serverurl : window.location.origin + "/api/app";
  return baseUrl;
}
export const appInfo = {
  applogo: typeof defaultLogo !== "undefined" ? defaultLogo : logo,
  appId: process.env.REACT_APP_APPID ? process.env.REACT_APP_APPID : "opensign",
  baseUrl: serverUrl_fn(),
  defaultRole: "contracts_User",
  fev_Icon: "/favicon.png",
  googleClientId:
    runtimeConfig.auth.googleClientId ||
    (runtimeConfig.brandKey === "opensign" &&
    process.env.REACT_APP_GOOGLECLIENTID
      ? `${process.env.REACT_APP_GOOGLECLIENTID}`
      : ""),
  metaDescription:
    "PatriotSign: document signing by Patriot Consulting",
  settings: [
    {
      role: "contracts_Admin",
      menuId: "VPh91h0ZHk",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_OrgAdmin",
      menuId: "VPh91h0ZHk",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_Editor",
      menuId: "H9vRfEYKhT",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_User",
      menuId: "H9vRfEYKhT",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    }
  ]
};
