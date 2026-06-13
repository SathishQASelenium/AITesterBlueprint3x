import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const jiraTarget = (env.VITE_JIRA_BASE_URL || 'https://assathish301.atlassian.net').replace(/\/$/, '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/jira-api': {
          target: jiraTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/jira-api/, ''),
          secure: true,
        },
      },
    },
  }
})
