/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RankingImport } from './routes/ranking'
import { Route as BiancaImport } from './routes/bianca'
import { Route as AuthGuardedImport } from './routes/_auth-guarded'
import { Route as SignInIndexImport } from './routes/sign-in/index'
import { Route as RegisterIndexImport } from './routes/register/index'
import { Route as AuthGuardedIndexImport } from './routes/_auth-guarded/index'
import { Route as UsersNicknameImport } from './routes/users/$nickname'
import { Route as AuthGuardedMeRouteImport } from './routes/_auth-guarded/me/route'
import { Route as UsersIdUserIdImport } from './routes/users/id/$userId'

// Create/Update Routes

const RankingRoute = RankingImport.update({
  id: '/ranking',
  path: '/ranking',
  getParentRoute: () => rootRoute,
} as any)

const BiancaRoute = BiancaImport.update({
  id: '/bianca',
  path: '/bianca',
  getParentRoute: () => rootRoute,
} as any)

const AuthGuardedRoute = AuthGuardedImport.update({
  id: '/_auth-guarded',
  getParentRoute: () => rootRoute,
} as any)

const SignInIndexRoute = SignInIndexImport.update({
  id: '/sign-in/',
  path: '/sign-in/',
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  id: '/register/',
  path: '/register/',
  getParentRoute: () => rootRoute,
} as any)

const AuthGuardedIndexRoute = AuthGuardedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthGuardedRoute,
} as any)

const UsersNicknameRoute = UsersNicknameImport.update({
  id: '/users/$nickname',
  path: '/users/$nickname',
  getParentRoute: () => rootRoute,
} as any)

const AuthGuardedMeRouteRoute = AuthGuardedMeRouteImport.update({
  id: '/me',
  path: '/me',
  getParentRoute: () => AuthGuardedRoute,
} as any)

const UsersIdUserIdRoute = UsersIdUserIdImport.update({
  id: '/users/id/$userId',
  path: '/users/id/$userId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth-guarded': {
      id: '/_auth-guarded'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthGuardedImport
      parentRoute: typeof rootRoute
    }
    '/bianca': {
      id: '/bianca'
      path: '/bianca'
      fullPath: '/bianca'
      preLoaderRoute: typeof BiancaImport
      parentRoute: typeof rootRoute
    }
    '/ranking': {
      id: '/ranking'
      path: '/ranking'
      fullPath: '/ranking'
      preLoaderRoute: typeof RankingImport
      parentRoute: typeof rootRoute
    }
    '/_auth-guarded/me': {
      id: '/_auth-guarded/me'
      path: '/me'
      fullPath: '/me'
      preLoaderRoute: typeof AuthGuardedMeRouteImport
      parentRoute: typeof AuthGuardedImport
    }
    '/users/$nickname': {
      id: '/users/$nickname'
      path: '/users/$nickname'
      fullPath: '/users/$nickname'
      preLoaderRoute: typeof UsersNicknameImport
      parentRoute: typeof rootRoute
    }
    '/_auth-guarded/': {
      id: '/_auth-guarded/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthGuardedIndexImport
      parentRoute: typeof AuthGuardedImport
    }
    '/register/': {
      id: '/register/'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof rootRoute
    }
    '/sign-in/': {
      id: '/sign-in/'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInIndexImport
      parentRoute: typeof rootRoute
    }
    '/users/id/$userId': {
      id: '/users/id/$userId'
      path: '/users/id/$userId'
      fullPath: '/users/id/$userId'
      preLoaderRoute: typeof UsersIdUserIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface AuthGuardedRouteChildren {
  AuthGuardedMeRouteRoute: typeof AuthGuardedMeRouteRoute
  AuthGuardedIndexRoute: typeof AuthGuardedIndexRoute
}

const AuthGuardedRouteChildren: AuthGuardedRouteChildren = {
  AuthGuardedMeRouteRoute: AuthGuardedMeRouteRoute,
  AuthGuardedIndexRoute: AuthGuardedIndexRoute,
}

const AuthGuardedRouteWithChildren = AuthGuardedRoute._addFileChildren(
  AuthGuardedRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AuthGuardedRouteWithChildren
  '/bianca': typeof BiancaRoute
  '/ranking': typeof RankingRoute
  '/me': typeof AuthGuardedMeRouteRoute
  '/users/$nickname': typeof UsersNicknameRoute
  '/': typeof AuthGuardedIndexRoute
  '/register': typeof RegisterIndexRoute
  '/sign-in': typeof SignInIndexRoute
  '/users/id/$userId': typeof UsersIdUserIdRoute
}

export interface FileRoutesByTo {
  '/bianca': typeof BiancaRoute
  '/ranking': typeof RankingRoute
  '/me': typeof AuthGuardedMeRouteRoute
  '/users/$nickname': typeof UsersNicknameRoute
  '/': typeof AuthGuardedIndexRoute
  '/register': typeof RegisterIndexRoute
  '/sign-in': typeof SignInIndexRoute
  '/users/id/$userId': typeof UsersIdUserIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth-guarded': typeof AuthGuardedRouteWithChildren
  '/bianca': typeof BiancaRoute
  '/ranking': typeof RankingRoute
  '/_auth-guarded/me': typeof AuthGuardedMeRouteRoute
  '/users/$nickname': typeof UsersNicknameRoute
  '/_auth-guarded/': typeof AuthGuardedIndexRoute
  '/register/': typeof RegisterIndexRoute
  '/sign-in/': typeof SignInIndexRoute
  '/users/id/$userId': typeof UsersIdUserIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/bianca'
    | '/ranking'
    | '/me'
    | '/users/$nickname'
    | '/'
    | '/register'
    | '/sign-in'
    | '/users/id/$userId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/bianca'
    | '/ranking'
    | '/me'
    | '/users/$nickname'
    | '/'
    | '/register'
    | '/sign-in'
    | '/users/id/$userId'
  id:
    | '__root__'
    | '/_auth-guarded'
    | '/bianca'
    | '/ranking'
    | '/_auth-guarded/me'
    | '/users/$nickname'
    | '/_auth-guarded/'
    | '/register/'
    | '/sign-in/'
    | '/users/id/$userId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthGuardedRoute: typeof AuthGuardedRouteWithChildren
  BiancaRoute: typeof BiancaRoute
  RankingRoute: typeof RankingRoute
  UsersNicknameRoute: typeof UsersNicknameRoute
  RegisterIndexRoute: typeof RegisterIndexRoute
  SignInIndexRoute: typeof SignInIndexRoute
  UsersIdUserIdRoute: typeof UsersIdUserIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthGuardedRoute: AuthGuardedRouteWithChildren,
  BiancaRoute: BiancaRoute,
  RankingRoute: RankingRoute,
  UsersNicknameRoute: UsersNicknameRoute,
  RegisterIndexRoute: RegisterIndexRoute,
  SignInIndexRoute: SignInIndexRoute,
  UsersIdUserIdRoute: UsersIdUserIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth-guarded",
        "/bianca",
        "/ranking",
        "/users/$nickname",
        "/register/",
        "/sign-in/",
        "/users/id/$userId"
      ]
    },
    "/_auth-guarded": {
      "filePath": "_auth-guarded.tsx",
      "children": [
        "/_auth-guarded/me",
        "/_auth-guarded/"
      ]
    },
    "/bianca": {
      "filePath": "bianca.tsx"
    },
    "/ranking": {
      "filePath": "ranking.tsx"
    },
    "/_auth-guarded/me": {
      "filePath": "_auth-guarded/me/route.tsx",
      "parent": "/_auth-guarded"
    },
    "/users/$nickname": {
      "filePath": "users/$nickname.tsx"
    },
    "/_auth-guarded/": {
      "filePath": "_auth-guarded/index.tsx",
      "parent": "/_auth-guarded"
    },
    "/register/": {
      "filePath": "register/index.tsx"
    },
    "/sign-in/": {
      "filePath": "sign-in/index.tsx"
    },
    "/users/id/$userId": {
      "filePath": "users/id/$userId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
