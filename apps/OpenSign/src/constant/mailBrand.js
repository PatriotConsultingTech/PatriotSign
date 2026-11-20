import { getRuntimeConfig } from "./runtimeConfig";

const OPEN_SIGN_NAME = "PatriotSign";
const PATRIOT_EMAIL_LOGO_PATH = "/patriot-consulting-primary-logo.png";
const PATRIOT_EMAIL_ACCENT = "#00477B";

function resolveEmailLogoUrl(logoUrl, appUrl) {
  if (!logoUrl?.startsWith("/")) return logoUrl;

  const baseUrl = appUrl || globalThis.location?.origin;
  if (!baseUrl) return "";

  try {
    return new URL(logoUrl, baseUrl).href;
  } catch {
    return "";
  }
}

export function resolveMailBrandPresentation(storedAppName = "") {
  const runtimeConfig = getRuntimeConfig();
  const deploymentAppName = runtimeConfig.productName || OPEN_SIGN_NAME;
  const appName = storedAppName || deploymentAppName;
  const usesDeploymentBrand = appName === deploymentAppName;

  const configuredLogoUrl = usesDeploymentBrand
    ? runtimeConfig.assets.logoUrl ||
      (runtimeConfig.brandKey === "opensign" ? PATRIOT_EMAIL_LOGO_PATH : "")
    : "";
  const logoUrl = resolveEmailLogoUrl(
    configuredLogoUrl,
    runtimeConfig.urls.app
  );

  const accentColor = runtimeConfig.theme.emailAccent || PATRIOT_EMAIL_ACCENT;

  return { appName, logoUrl, accentColor };
}

export function renderMailBrandLogo({ appName, logoUrl }) {
  if (!logoUrl) return "";
  return `<div style='padding:10px'><img src='${logoUrl}' height='50' /></div>`;
}
