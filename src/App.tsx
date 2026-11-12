import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { RoleGuard, RoleHome } from "./components/auth/role-access";
import { UserRole } from "./types";

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "@/components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import SubjectsList from "./pages/subjects/List";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsEdit from "./pages/subjects/edit";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesEdit from "./pages/classes/edit";
import ClassesShow from "./pages/classes/show";
import UsersList from "./pages/users/list.tsx";
import UsersCreate from "./pages/users/create";
import UsersEdit from "./pages/users/edit";
import UsersShow from "./pages/users/show";
import StudentDashboard from "./pages/student/dashboard";
import StudentClasses from "./pages/student/classes";
import StudentClassShow from "./pages/student/class-show";
import TeacherDashboard from "./pages/teacher/dashboard";
import TeacherClasses from "./pages/teacher/classes";
import TeacherClassManage from "./pages/teacher/class-manage";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentsEdit from "./pages/departments/edit";
import {CircleUserRound, GraduationCap, Home, ListCollapseIcon, UsersRound} from "lucide-react";
import {BookOpen} from "lucide-react";


function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
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
                  list: '/admin',
                  meta: {label: 'Home', icon: <Home />, roles: [UserRole.ADMIN]}
                  },
                  {
                    name: 'subjects',
                    list: '/subjects',
                    create: '/subjects/create',
                    edit: '/subjects/edit/:id',
                    meta: {label: 'Subject', icon: <BookOpen />, roles: [UserRole.ADMIN]}
                  },
                  {
                    name: 'classes',
                    list: '/classes',
                    create: '/classes/create',
                    edit: '/classes/edit/:id',
                    show: '/classes/show/:id',
                    meta: {label: 'Classes', icon: <GraduationCap />, roles: [UserRole.ADMIN]}
                  },
                  {
                    name: 'departments',
                    list: '/departments',
                    create: '/departments/create',
                    edit: '/departments/edit/:id',
                    meta: {label: 'Departments', icon: <ListCollapseIcon />, roles: [UserRole.ADMIN]}
                  },
                  {
                    name: 'users',
                    list: '/users',
                    create: '/users/create',
                    edit: '/users/edit/:id',
                    show: '/users/show/:id',
                    meta: {label: 'Utilizadores', icon: <UsersRound />, roles: [UserRole.ADMIN]}
                  },
                  {
                    name: 'teacher-dashboard',
                    list: '/teacher',
                    meta: {label: 'Início', icon: <Home />, roles: [UserRole.TEACHER]}
                  },
                  {
                    name: 'teacher-classes',
                    list: '/teacher/classes',
                    show: '/teacher/classes/:id',
                    meta: {label: 'Turmas', icon: <GraduationCap />, roles: [UserRole.TEACHER]}
                  },
                  {
                    name: 'student-dashboard',
                    list: '/student',
                    meta: {label: 'Início', icon: <Home />, roles: [UserRole.STUDENT]}
                  },
                  {
                    name: 'student-classes',
                    list: '/student/classes',
                    show: '/student/classes/:id',
                    meta: {label: 'Turmas', icon: <GraduationCap />, roles: [UserRole.STUDENT]}
                  },
                  {
                    name: 'student-perfil',
                    list: '/student/perfil',
                    meta: {label: 'Perfil', icon: <CircleUserRound />, roles: [UserRole.STUDENT]}
                  }
                ]
              }
            >
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={
                    <Authenticated key="protected-routes" fallback={<CatchAllNavigate to="/login" />}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }>

                  <Route path="/" element={<RoleHome />} />

                  <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
                    <Route path="admin" element={<Dashboard />} />

                    <Route path="subjects">
                      <Route index element={<SubjectsList />} />
                      <Route path="create" element={<SubjectsCreate />} />
                      <Route path="edit/:id" element={<SubjectsEdit />} />
                    </Route>

                    <Route path="classes">
                      <Route index element={<ClassesList />} />
                      <Route path="create" element={<ClassesCreate />} />
                      <Route path="edit/:id" element={<ClassesEdit />} />
                      <Route path="show/:id" element={<ClassesShow />} />
                    </Route>

                   <Route path="departments">
                      <Route index element={<DepartmentsList />} />
                      <Route path="create" element={<DepartmentsCreate />} />
                      <Route path="edit/:id" element={<DepartmentsEdit />} />
                    </Route>

                    <Route path="users">
                      <Route index element={<UsersList />} />
                      <Route path="create" element={<UsersCreate />} />
                      <Route path="edit/:id" element={<UsersEdit />} />
                      <Route path="show/:id" element={<UsersShow />} />
                    </Route>
                  </Route>

                  <Route element={<RoleGuard allowedRoles={[UserRole.TEACHER]} />}>
                    <Route path="teacher">
                      <Route index element={<TeacherDashboard />} />
                      <Route path="classes" element={<TeacherClasses />} />
                      <Route path="classes/:id" element={<TeacherClassManage />} />
                    </Route>
                  </Route>

                  <Route element={<RoleGuard allowedRoles={[UserRole.STUDENT]} />}>
                    <Route path="student">
                      <Route index element={<StudentDashboard />} />
                      <Route path="classes" element={<StudentClasses />} />
                      <Route path="classes/:id" element={<StudentClassShow />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler
                handler={({ autoGeneratedTitle }) => autoGeneratedTitle.replaceAll("Refine", "Classroom")}
              />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
