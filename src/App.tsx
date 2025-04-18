import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthPage } from '@/pages/auth/AuthPage'
import { HomePage } from '@/pages/home/HomePage'
import { Dashboard } from '@/pages/project/Dashboard'
import { Defects } from '@/pages/project/Defects'
import { Iterations } from '@/pages/project/Iterations'
import { ProjectLayout } from '@/pages/project/ProjectLayout'
import { Requirements } from '@/pages/project/Requirements'
import { Tasks } from '@/pages/project/Tasks'
import { antdThemeConfig } from '@/styles/antdTheme'
import { globalStyles } from '@/styles/globalStyles'
import { theme } from '@/styles/theme'
import { ThemeProvider } from '@emotion/react'
import { ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import '@/styles/reset.css'
import 'normalize.css'

const root = createRoot(
  document.getElementById('root') as HTMLElement,
)

root.render(
  <ConfigProvider theme={antdThemeConfig}>
    <ThemeProvider theme={theme}>
      {globalStyles}
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<HomePage />} />
            <Route path="project/:projectId" element={<ProjectLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="requirements" element={<Requirements />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="defects" element={<Defects />} />
              <Route path="iterations" element={<Iterations />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </ConfigProvider>,
)
