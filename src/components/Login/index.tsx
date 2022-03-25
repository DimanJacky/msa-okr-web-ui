import * as React from "react";
import { useCallback, useEffect } from "react";

import { useKeycloak } from "@react-keycloak/web";

const LoginPage = () => {
  const { keycloak, initialized } = useKeycloak();

  const login = useCallback(() => {
    keycloak?.login();
  }, [keycloak]);

  useEffect(() => {
    if (!initialized) return;

    if (!keycloak.authenticated) login();
  }, [keycloak.authenticated]);

  return <div />;
};

export default LoginPage;
