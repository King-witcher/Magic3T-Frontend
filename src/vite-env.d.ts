/// <reference types="vite/client" />

declare global {
  type Result<T, E> = ResultClass<T, E>
  interface Window {
    Ok<T, E>(data: T): ResultClass<T, E>
    Err<T, E>(error: E): ResultClass<T, E>
  }

  namespace NodeJS {
    interface ProcessEnv {
      API: string
    }
  }

  interface ImportMeta {
    env: {
      VITE_API_URL: string
    }
  }
}

declare module 'react' {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}
