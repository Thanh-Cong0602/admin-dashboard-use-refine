import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { pathName } from "./common/constant/routes";
import Layout from "./components/layout";
import { resources } from "./config/resources";
import {
  CompanyEditPage,
  CompanyList,
  Create,
  ForgotPassword,
  Home,
  Login,
  Register,
} from "./pages";
import { authProvider } from "./providers";
import { dataProvider, liveProvider } from "./providers/data";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "Vu5ryS-ajdMZn-sjXpIM",
                liveMode: "auto",
              }}
            >
              <Routes>
                {/* <Route index element={<WelcomePage />} /> */}

                <Route path={pathName.LOGIN} element={<Login />} />

                <Route path={pathName.REGISTER} element={<Register />} />

                <Route
                  path={pathName.FORGOT_PASSWORD}
                  element={<ForgotPassword />}
                />

                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to={pathName.LOGIN} />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} />

                  <Route path={pathName.COMPANIES}>
                    <Route index element={<CompanyList />} />
                    <Route path="new" element={<Create />} />
                    <Route path="edit/:id" element={<CompanyEditPage />} />
                  </Route>
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
