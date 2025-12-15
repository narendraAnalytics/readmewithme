---
title: Protect content and read user data
description: Learn how to use Clerk's hooks to protect content and read user
  data in your Expo application.
metadata:
  title: Read session and user data in your Expo app with Clerk
sdk: nextjs, expo, react-router, remix, tanstack-react-start, astro, nuxt
sdkScoped: "true"
canonical: /docs/:sdk:/guides/users/reading
lastUpdated: 2025-12-11T21:01:08.000Z
availableSdks: nextjs,expo,react-router,remix,tanstack-react-start,astro,nuxt
notAvailableSdks: react,js-frontend,chrome-extension,android,ios,expressjs,fastify,go,vue,ruby,js-backend
activeSdk: expo
sourceFile: /docs/guides/users/reading.expo.mdx
---

Clerk offers a comprehensive suite of hooks that expose low-level access to authentication, session management, and multi-tenancy. With Clerk hooks, you can access and manage user data, handle sign-in and sign-up flows, control session management, and implement advanced flows like session reverification for sensitive actions. By using these hooks, you can extend or replace Clerk's built-in components and customize how authentication behaves in your application.

This guide demonstrates how to use the `useAuth()` and `useUser()` hooks to protect content and read user data in your Expo application.

## Session data example

{/*TODO: Keep in sync with _partials/hooks/use-auth*/}

The <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useAuth()</SDKLink>{{ target: '_blank' }} hook provides information about the current auth state, as well as helper methods to manage the current session.

The following example demonstrates how to use the available properties of the `useAuth()` hook.

```tsx {{ filename: 'components/UseAuthExample.tsx' }}
import { useAuth } from '@clerk/clerk-expo'
import { Text, View, TouchableOpacity } from 'react-native'

export default function UseAuthExample() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()

  const fetchExternalData = async () => {
    // Use `getToken()` to get the current user's session token
    const token = await getToken()

    // Use `token` to fetch data from an external API
    const response = await fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.json()
  }

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <Text>Loading...</Text>
  }

  // Use `isSignedIn` to check if the user is signed in
  if (!isSignedIn) {
    // You could also add a redirect to the sign-in page here
    return <Text>Sign in to view this page</Text>
  }

  return (
    <View>
      <Text>
        Hello, {userId}! Your current active session is {sessionId}.
      </Text>
      <TouchableOpacity onPress={fetchExternalData}>
        <Text>Fetch Data</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## User data example

{/*TODO: Keep in sync with _partials/hooks/use-user*/}

The <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink>{{ target: '_blank' }} hook enables you to access the <SDKLink href="/docs/reference/javascript/user" sdks={["js-frontend"]} code={true}>User</SDKLink> object, which contains the current user's data such as their full name.

The following example demonstrates how to use `useUser()` to check if the user is signed in and display their first name.

```tsx {{ filename: 'src/Example.tsx' }}
import { useUser } from '@clerk/clerk-expo'
import { Text } from 'react-native'

export default function Example() {
  const { isSignedIn, user, isLoaded } = useUser()

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <Text>Loading...</Text>
  }

  // Use `isSignedIn` to protect the content
  if (!isSignedIn) {
    return <Text>Sign in to view this page</Text>
  }

  // Use `user` to access the current user's data
  return <Text>Hello {user.firstName}!</Text>
}
```

-----------------------------------------------

---

title: Protect content and read user data
description: Learn how to use Clerk's hooks to protect content and read user
  data in your Expo application.
metadata:
  title: Read session and user data in your Expo app with Clerk
sdk: nextjs, expo, react-router, remix, tanstack-react-start, astro, nuxt
sdkScoped: "true"
canonical: /docs/:sdk:/guides/users/reading
lastUpdated: 2025-12-11T21:01:08.000Z
availableSdks: nextjs,expo,react-router,remix,tanstack-react-start,astro,nuxt
notAvailableSdks: react,js-frontend,chrome-extension,android,ios,expressjs,fastify,go,vue,ruby,js-backend
activeSdk: expo
sourceFile: /docs/guides/users/reading.expo.mdx
---

Clerk offers a comprehensive suite of hooks that expose low-level access to authentication, session management, and multi-tenancy. With Clerk hooks, you can access and manage user data, handle sign-in and sign-up flows, control session management, and implement advanced flows like session reverification for sensitive actions. By using these hooks, you can extend or replace Clerk's built-in components and customize how authentication behaves in your application.

This guide demonstrates how to use the `useAuth()` and `useUser()` hooks to protect content and read user data in your Expo application.

## Session data example

{/*TODO: Keep in sync with _partials/hooks/use-auth*/}

The <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useAuth()</SDKLink>{{ target: '_blank' }} hook provides information about the current auth state, as well as helper methods to manage the current session.

The following example demonstrates how to use the available properties of the `useAuth()` hook.

```tsx {{ filename: 'components/UseAuthExample.tsx' }}
import { useAuth } from '@clerk/clerk-expo'
import { Text, View, TouchableOpacity } from 'react-native'

export default function UseAuthExample() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()

  const fetchExternalData = async () => {
    // Use `getToken()` to get the current user's session token
    const token = await getToken()

    // Use `token` to fetch data from an external API
    const response = await fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.json()
  }

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <Text>Loading...</Text>
  }

  // Use `isSignedIn` to check if the user is signed in
  if (!isSignedIn) {
    // You could also add a redirect to the sign-in page here
    return <Text>Sign in to view this page</Text>
  }

  return (
    <View>
      <Text>
        Hello, {userId}! Your current active session is {sessionId}.
      </Text>
      <TouchableOpacity onPress={fetchExternalData}>
        <Text>Fetch Data</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## User data example

{/*TODO: Keep in sync with _partials/hooks/use-user*/}

The <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink>{{ target: '_blank' }} hook enables you to access the <SDKLink href="/docs/reference/javascript/user" sdks={["js-frontend"]} code={true}>User</SDKLink> object, which contains the current user's data such as their full name.

The following example demonstrates how to use `useUser()` to check if the user is signed in and display their first name.

```tsx {{ filename: 'src/Example.tsx' }}
import { useUser } from '@clerk/clerk-expo'
import { Text } from 'react-native'

export default function Example() {
  const { isSignedIn, user, isLoaded } = useUser()

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <Text>Loading...</Text>
  }

  // Use `isSignedIn` to protect the content
  if (!isSignedIn) {
    return <Text>Sign in to view this page</Text>
  }

  // Use `user` to access the current user's data
  return <Text>Hello {user.firstName}!</Text>
}
```
