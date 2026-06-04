// libraries
import type { FC } from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router';
import { Home } from 'components/Home';
import { Layout } from 'components/Layout';
import { Login } from 'components/Login';
import { NotFound } from 'components/NotFound';
import { Profile } from 'components/Profile';
import { ProjectDetail } from 'components/ProjectDetail';
import { ProtectedRoutes } from 'components/ProtectedRoutes';
import { Register } from 'components/Register';
import { TaskDetail } from 'components/TaskDetail';
// store
import { store } from 'context/store';

// components
import { AuthBootstrap } from 'app/AuthBootstrap';
import { ErrorBoundary } from 'app/ErrorBoundary';
import { QueryProvider } from 'app/QueryProvider';

const App: FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <QueryProvider>
        <AuthBootstrap>
          <Layout>
            <Routes>
              <Route path="/">
                <Route element={<Home />} index />
                <Route element={<Login />} path="login" />
                <Route element={<Register />} path="register" />
                <Route element={<ProtectedRoutes />}>
                  <Route element={<Profile />} path="profile" />
                  <Route element={<ProjectDetail />} path="project/:projectId" />
                  <Route element={<TaskDetail />} path="project/:projectId/task/:taskId" />
                </Route>
              </Route>
              <Route element={<NotFound />} path="*" />
            </Routes>
          </Layout>
        </AuthBootstrap>
      </QueryProvider>
    </Provider>
  </ErrorBoundary>
);

export default App;
