import { createContext, useContext, useState, useCallback } from 'react';

const SettingsContext = createContext(null);

// Auto-populated from .env (VITE_ prefix) — works on first load with zero manual entry
const ENV_DEFAULTS = {
  jira: {
    baseUrl: import.meta.env.VITE_JIRA_BASE_URL || '',
    email: import.meta.env.VITE_JIRA_EMAIL || '',
    token: import.meta.env.VITE_JIRA_API_TOKEN || '',
  },
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    model: import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b',
  },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('blast-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        jira: { ...ENV_DEFAULTS.jira, ...parsed.jira },
        groq: { ...ENV_DEFAULTS.groq, ...parsed.groq },
      };
    }
  } catch {
    // ignore corrupt localStorage
  }
  return ENV_DEFAULTS;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const updateJiraSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, jira: { ...prev.jira, ...patch } };
      localStorage.setItem('blast-settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateGroqSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, groq: { ...prev.groq, ...patch } };
      localStorage.setItem('blast-settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetToEnvDefaults = useCallback(() => {
    localStorage.removeItem('blast-settings');
    setSettings(ENV_DEFAULTS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, updateJiraSettings, updateGroqSettings, resetToEnvDefaults }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
