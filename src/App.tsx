import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { useKeycloak } from "@react-keycloak/web";
import { Redirect, Route, Switch } from "react-router";
import ListOfDivisionsPage from "./components/ListOfDivisionsPage";
import Accordion from "./components/Accordion";
import { saveUser, setRole } from "./store/User/reducer";
import { useAppDispatch } from "./store";
import LoginPage from "./components/Login";
import Header from "./components/Header";
import ErrorModal from "./modules/ErrorModal";
import { instance } from "./API";
import Footer from "./components/Footer";
import FooterData from "./constants/Footer/const";
import styles from "./index.module.css";

function App() {
  const { keycloak } = useKeycloak();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const setHeaderAuthorizationToken = () => {
    if (keycloak.token) {
      instance.defaults.headers.common.Authorization = `Bearer ${keycloak.token}`;
    }
  };
  useEffect(() => {
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(50);
    };
    keycloak.onAuthSuccess = setHeaderAuthorizationToken;
    keycloak.onAuthRefreshSuccess = setHeaderAuthorizationToken;
    keycloak.loadUserInfo().then((data: any) => {
      const role = keycloak.realmAccess;
      dispatch(saveUser(data));
      dispatch(setRole(role?.roles));
      setLoading(false);
    });
  }, [!keycloak.authenticated]);
  if (!keycloak.authenticated) {
    return <LoginPage />;
  }

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
          <Header />
          <div className={styles.contentWrapper}>
            <div className="App">
              <Switch>
                <Route path="/" exact render={() => <ListOfDivisionsPage />} />
                <Route path="/units_targets/unit_type/:id" render={() => <ListOfDivisionsPage />} />
                <Route path="/units_targets/:id" render={() => <Accordion />} />
                <Route path="/login" render={() => <LoginPage />} />
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
          <Footer text={FooterData.textFooter} />
          <ErrorModal />
        </>
      )}
    </>
  );
}

export default App;
