import {
  Refine,
  GitHubBanner,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgot-password";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { Header } from "./components/refine-ui/layout/header";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "@/components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import "./pages/dashboard";
import Dashboard from "./pages/dashboard";
import SubjectsList from "./pages/subjects/List";
import SubjectsCreate from "./pages/subjects/create";
import {Home} from "lucide-react";
import {BookOpen} from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "M4Jnqz-Tp2un6-2RwcbX",
              }}

              resources={
                [
                  {
                  name:'Dashboard',
                  list: '/',
                  meta: {label: 'Home', icon: <Home />}
                  },
                  {
                    name: 'subjects',
                    list: '/subjects',
                    create: '/subjects/create',
                    meta: {label: 'Subject', icon: <BookOpen />}
                  }
                ]
              }
            >
              <Routes>
                  <Route element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }>
                  <Route path="/" element={<Dashboard />}/>
                    <Route path="subjects">
                      <Route index element={<SubjectsList />} />
                      <Route path="create" element={<SubjectsCreate />} />
                    </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
