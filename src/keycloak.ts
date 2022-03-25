import Keycloak from "keycloak-js";

const keycloak = Keycloak({
  // @ts-ignore
  url: `${window.KEYCLOAK_ADDRESS}/auth`,
  // @ts-ignore
  realm: window.REALM,
  // @ts-ignore
  clientId: window.CLIENTID
});

export default keycloak;
