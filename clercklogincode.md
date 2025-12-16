app/_layout.tsx

import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'

function RootLayoutNav() {
  return (
    <ClerkProvider>
      <Slot />
    </ClerkProvider>
  )
}
-----------------------------------

app/_layout.tsx

import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  )
}

--------------------------------------

app/(auth)/_layout.tsx

import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}

------------------------------------------

app/(auth)/sign-up.tsx

import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View>
      <>
        <Text>Sign up</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>
      </>
    </View>
  )
}

/app/(auth)/sign-in.tsx

import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      <Text>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

app/components/SignOutButton.tsx

import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See <https://clerk.com/docs/custom-flows/error-handling>
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  )
}

app/(home)/_layout.tsx

import { Stack } from 'expo-router/stack'

export default function Layout() {
  return <Stack />
}

app/(home)/index.tsx

import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/app/components/SignOutButton'

export default function Page() {
  const { user } = useUser()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}

----------------------------------------

-------------------------------------------------------------------

---

title: "`<SignIn />` component"
description: Clerk's <SignIn /> component renders a UI for signing in users.
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/reference/components/authentication/sign-in
lastUpdated: 2025-12-12T23:42:35.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,expressjs,fastify,go,ruby,js-backend
activeSdk: expo
sourceFile: /docs/reference/components/authentication/sign-in.mdx
---

![The \<SignIn /> component renders a UI for signing in users.](/docs/images/ui-components/sign-in.png){{ style: { maxWidth: '460px' } }}

The `<SignIn />` component renders a UI to allow users to sign in or sign up by default. The functionality of the `<SignIn />` component is controlled by the instance settings you specify in the [Clerk Dashboard](https://dashboard.clerk.com), such as [sign-in and sign-up options](/docs/guides/configure/auth-strategies/sign-up-sign-in-options) and [social connections](/docs/guides/configure/auth-strategies/social-connections/all-providers). You can further customize your `<SignIn />` component by passing additional <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>properties</SDKLink> at the time of rendering. The `<SignIn />` component also displays any <Tooltip><TooltipTrigger>session tasks</TooltipTrigger><TooltipContent>**Session tasks** are requirements that users must fulfill in order to complete the authentication process, such as choosing an Organization.</TooltipContent></Tooltip> that are required for the user to complete after signing in.

> \[!NOTE]
> The `<SignUp/>` and `<SignIn/>` components cannot render when a user is already signed in, unless the application allows multiple sessions. If a user is already signed in and the application only allows a single session, Clerk will redirect the user to the Home URL instead.

<If sdk={["astro", "chrome-extension", "expo", "nextjs", "nuxt", "react", "react-router", "remix", "tanstack-react-start", "vue"]}>

## Example

  The following example includes basic implementation of the `<SignIn />` component. You can use this as a starting point for your own implementation.

  <If sdk="expo">
    > \[!NOTE]
    > This component can be used in Expo Web projects, but it isn't available in native environments (iOS or Android). For native apps, build a custom UI using Clerk hooks. See [custom flows guides](/docs/guides/development/custom-flows/overview) for details.

    If you would like to create a dedicated `/sign-in` page in your Expo application, there are a few requirements you must follow. See the [dedicated guide](/docs/guides/development/web-support/custom-sign-in-or-up-page) for more information.

    ```tsx {{ filename: '/app/sign-in.web.tsx' }}
    import { SignIn } from '@clerk/clerk-expo/web'

    export default function SignInPage() {
      return <SignIn />
    }
    ```
  </If>
</If>

## Properties

All props are optional.

<Properties>
  * `appearance`
  * <code><SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Appearance</SDKLink> | undefined</code>

  Optional object to style your components. Will only affect <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Clerk components</SDKLink> and not [Account Portal](/docs/guides/account-portal/overview) pages.

  ***

* `fallback`
* `ReactNode`

  An optional element to be rendered while the component is mounting.

  ***

* `fallbackRedirectUrl`
* `string`

  The fallback URL to redirect to after the user signs in, if there's no `redirect_url` in the path already. Defaults to `/`. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `forceRedirectUrl`
* `string`

  If provided, this URL will always be redirected to after the user signs in. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `initialValues`
* <SDKLink href="/docs/reference/javascript/types/sign-in-initial-values" sdks={["js-frontend"]} code={true}>SignInInitialValues</SDKLink>

  The values used to prefill the sign-in fields with.

  ***

* `oauthFlow`
* `"redirect" | "popup" | "auto"`

  Determines how OAuth authentication is performed. Accepts the following properties:

* `"redirect"`: Redirect to the OAuth provider on the current page.
* `"popup"`: Open a popup window.
* `"auto"`: Choose the best method based on whether the current domain typically requires the `"popup"` flow to correctly perform authentication.

  Defaults to `"auto"`.

  ***

* `path`
* `string`

  The path where the component is mounted on when `routing` is set to `path`. It is ignored in hash-based routing. For example: `/sign-in`.

  ***

* `routing`
* `'hash' | 'path'`

  The [routing](/docs/guides/how-clerk-works/routing) strategy for your pages. Defaults to `'path'` for frameworks that handle routing, such as Next.js and Remix. Defaults to `hash` for all other SDK's, such as React.

  ***

* `signUpFallbackRedirectUrl`
* `string`

  The fallback URL to redirect to after the user signs up, if there's no `redirect_url` in the path already. Used for the 'Don't have an account? Sign up' link that's rendered. Defaults to `/`. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `signUpForceRedirectUrl`
* `string`

  If provided, this URL will always used as the redirect destination after the user signs up. Used for the 'Don't have an account? Sign up' link that's rendered. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `signUpUrl`
* `string`

  The full URL or path to the sign-up page. Used for the 'Don't have an account? Sign up' link that's rendered. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `transferable`
* `boolean`

  Indicates whether or not sign in attempts are transferable to the sign up flow. Defaults to `true`. When set to `false`, prevents opaque sign ups when a user attempts to sign in via OAuth with an email that doesn't exist.

  ***

* `waitlistUrl`
* `string`

  Full URL or path to the waitlist page. Use this property to provide the target of the 'Waitlist' link that's rendered. If `undefined`, will redirect to the [Account Portal waitlist page](/docs/guides/account-portal/overview#waitlist). If you've passed the `waitlistUrl` prop to the <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider></SDKLink> component, it will infer from that, and you can omit this prop.

  ***

* `withSignUp`
* `boolean`

  Opt into sign-in-or-up flow by setting this prop to `true`. When `true`, if a user does not exist, they will be prompted to sign up. If a user exists, they will be prompted to sign in. Defaults to `true` if the `CLERK_SIGN_IN_URL` environment variable is set. Otherwise, defaults to `false`.
</Properties>

## Customization

To learn about how to customize Clerk components, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>customization documentation</SDKLink>.

If Clerk's prebuilt components don't meet your specific needs or if you require more control over the logic, you can rebuild the existing Clerk flows using the Clerk API. For more information, see the [custom flow guides](/docs/guides/development/custom-flows/overview).

---

title: "`<SignUp />` component"
description: Clerk's <SignUp /> component renders a UI for signing up users.
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/reference/components/authentication/sign-up
lastUpdated: 2025-12-12T23:42:35.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,expressjs,fastify,go,ruby,js-backend
activeSdk: expo
sourceFile: /docs/reference/components/authentication/sign-up.mdx
---

![The \<SignUp /> component renders a UI for signing up users.](/docs/images/ui-components/sign-up.png){{ style: { maxWidth: '460px' } }}

The `<SignUp />` component renders a UI for signing up users. The functionality of the `<SignUp />` component is controlled by the instance settings you specify in the [Clerk Dashboard](https://dashboard.clerk.com), such as [sign-in and sign-up options](/docs/guides/configure/auth-strategies/sign-up-sign-in-options) and [social connections](/docs/guides/configure/auth-strategies/social-connections/all-providers). You can further customize your `<SignUp />` component by passing additional <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-up#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>properties</SDKLink> at the time of rendering. The `<SignUp />` component also displays any <Tooltip><TooltipTrigger>session tasks</TooltipTrigger><TooltipContent>**Session tasks** are requirements that users must fulfill in order to complete the authentication process, such as choosing an Organization.</TooltipContent></Tooltip> that are required for the user to complete after signing up.

> \[!NOTE]
> The `<SignUp/>` and `<SignIn/>` components cannot render when a user is already signed in, unless the application allows multiple sessions. If a user is already signed in and the application only allows a single session, Clerk will redirect the user to the Home URL instead.

<If sdk={["astro", "chrome-extension", "expo", "nextjs", "nuxt", "react", "react-router", "remix", "tanstack-react-start", "vue"]}>

## Example

  The following example includes basic implementation of the `<SignUp />` component. You can use this as a starting point for your own implementation.

  <If sdk="expo">
    > \[!NOTE]
    > This component can be used in Expo Web projects, but it isn't available in native environments (iOS or Android). For native apps, build a custom UI using Clerk hooks. See [custom flows guides](/docs/guides/development/custom-flows/overview) for details.

    ```jsx {{ filename: '/app/sign-up.web.tsx' }}
    import { SignUp } from '@clerk/clerk-expo/web'

    export default function SignUpPage() {
      return <SignUp />
    }
    ```
  </If>
</If>

## Properties

All props are optional.

<Properties>
  * `appearance`
  * <code><SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Appearance</SDKLink> | undefined</code>

  Optional object to style your components. Will only affect <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Clerk components</SDKLink> and not [Account Portal](/docs/guides/account-portal/overview) pages.

  ***

* `fallback`
* `ReactNode`

  An optional element to be rendered while the component is mounting.

  ***

* `fallbackRedirectUrl`
* `string`

  The fallback URL to redirect to after the user signs up, if there's no `redirect_url` in the path already. Defaults to `/`. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `forceRedirectUrl`
* `string`

  If provided, this URL will always be used as the redirect destination after the user signs up. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `initialValues`
* <SDKLink href="/docs/reference/javascript/types/sign-up-initial-values" sdks={["js-frontend"]} code={true}>SignUpInitialValues</SDKLink>

  The values used to prefill the sign-up fields with.

  ***

* `oauthFlow`
* `"redirect" | "popup" | "auto"`

  Determines how OAuth authentication is performed. Accepts the following properties:

* `"redirect"`: Redirect to the OAuth provider on the current page.
* `"popup"`: Open a popup window.
* `"auto"`: Choose the best method based on whether the current domain typically requires the `"popup"` flow to correctly perform authentication.

  Defaults to `"auto"`.

  ***

* `path`
* `string`

  The path where the component is mounted on when `routing` is set to `path`. It is ignored in hash-based routing. For example: `/sign-up`.

  ***

* `routing`
* `'hash' | 'path'`

  The [routing](/docs/guides/how-clerk-works/routing) strategy for your pages.  Defaults to `'path'` for frameworks that handle routing, such as Next.js and Remix. Defaults to `hash` for all other SDK's, such as React.

  ***

* `signInFallbackRedirectUrl`
* `string`

  The fallback URL to redirect to after the user signs in, if there's no `redirect_url` in the path already. Used for the 'Already have an account? Sign in' link that's rendered.  Defaults to `/`. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `signInForceRedirectUrl?`
* `string`

  If provided, this URL will always be redirected to after the user signs in. Used for the 'Already have an account? Sign in' link that's rendered. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `signInUrl`
* `string`

  The full URL or path to the sign-in page. Used for the 'Already have an account? Sign in' link that's rendered. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `unsafeMetadata`
* <SDKLink href="/docs/reference/javascript/types/metadata#sign-up-unsafe-metadata" sdks={["js-frontend"]} code={true}>SignUpUnsafeMetadata</SDKLink>

  Metadata that can be read and set from the frontend and the backend. Once the sign-up is complete, the value of this field will be automatically copied to the created user's unsafe metadata (`User.unsafeMetadata`). One common use case is to collect custom information about the user during the sign-up process and store it in this property. Read more about [unsafe metadata](/docs/guides/users/extending#unsafe-metadata).
</Properties>

## Customization

To learn about how to customize Clerk components, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>customization documentation</SDKLink>.

If Clerk's prebuilt components don't meet your specific needs or if you require more control over the logic, you can rebuild the existing Clerk flows using the Clerk API. For more information, see the [custom flow guides](/docs/guides/development/custom-flows/overview).

---

title: "`<UserAvatar />` component"
description: Clerk's <UserAvatar /> component is used to render the familiar
  user avatar on its own.
search:
  rank: 1
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/reference/components/user/user-avatar
lastUpdated: 2025-12-11T21:25:35.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,expressjs,fastify,go,ruby,js-backend
activeSdk: expo
sourceFile: /docs/reference/components/user/user-avatar.mdx
---

![The \<UserAvatar /> component renders the authenticated user's avatar on its own, a common UI element found across many websites and applications.](/docs/images/ui-components/user-avatar.png)

The `<UserAvatar />` component renders the authenticated user's avatar on its own, a common UI element found across many websites and applications.

<If sdk={["astro", "chrome-extension", "expo", "nextjs", "nuxt", "react", "react-router", "remix", "tanstack-react-start", "vue"]}>

## Example

  In the following example, `<UserAvatar />` is mounted inside a header component, which is a common pattern on many websites and applications. When the user is signed in, they will see their avatar.

  <If sdk="expo">
    > \[!NOTE]
    > This component can be used in Expo Web projects, but it isn't available in native environments (iOS or Android). For native apps, build a custom UI using Clerk hooks. See [custom flows guides](/docs/guides/development/custom-flows/overview) for details.

    ```jsx {{ filename: '/app/user-avatar.web.tsx' }}
    import { SignedIn, UserAvatar, SignInButton, SignedOut } from '@clerk/clerk-expo/web'

    export default function Header() {
      return (
        <header>
          <SignedIn>
            <UserAvatar />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
      )
    }
    ```
  </If>
</If>

## Properties

The `<UserAvatar />` component accepts the following properties, all of which are **optional**:

<Properties>
  * `rounded?`
  * `boolean`

  Determines whether the user avatar is displayed with rounded corners.

  ***

* `appearance?`
* <code><SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Appearance</SDKLink> | undefined</code>

  Optional object to style your components. Will only affect <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Clerk components</SDKLink> and not [Account Portal](/docs/guides/account-portal/overview) pages.

  ***

* `fallback?`
* `ReactNode`

  Optional element to be rendered while the component is mounting.
</Properties>

## Customization

To learn about how to customize Clerk components, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>customization documentation</SDKLink>.

---

title: "`<UserButton />` component"
description: Clerk's <UserButton /> component is used to render the familiar
  user button UI popularized by Google.
search:
  rank: 1
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/reference/components/user/user-button
lastUpdated: 2025-12-11T21:25:35.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,expressjs,fastify,go,ruby,js-backend
activeSdk: expo
sourceFile: /docs/reference/components/user/user-button.mdx
---

![The \<UserButton /> component renders the familiar user button UI popularized by Google.](/docs/images/ui-components/user-button.png){{ style: { maxWidth: '436px' } }}

The `<UserButton />` component renders the familiar user button UI popularized by Google. When selected, it opens a dropdown menu with options to manage account settings and sign out. The "Manage account" option launches the <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component, providing access to profile and security settings.

For users that have [multi-session](/docs/guides/secure/session-options#multi-session-applications) enabled, the `<UserButton />` also allows users to sign into multiple accounts at once and instantly switch between them without the need for a full page reload. Learn more [here](/docs/guides/secure/session-options#multi-session-applications).

<If sdk={["astro", "chrome-extension", "expo", "nextjs", "nuxt", "react", "react-router", "remix", "tanstack-react-start", "vue"]}>

## Example

  In the following example, `<UserButton />` is mounted inside a header component, which is a common pattern on many websites and applications. When the user is signed in, they will see their avatar and be able to open the popup menu.

  <If sdk="expo">
    > \[!NOTE]
    > This component can be used in Expo Web projects, but it isn't available in native environments (iOS or Android). For native apps, build a custom UI using Clerk hooks. See [custom flows guides](/docs/guides/development/custom-flows/overview) for details.

    ```jsx {{ filename: '/app/user-button.web.tsx' }}
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-expo/web'

    export default function Header() {
      return (
        <header>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
      )
    }
    ```
  </If>
</If>

## Properties

The `<UserButton />` component accepts the following properties, all of which are **optional**:

<Properties>
  * `afterMultiSessionSingleSignOutUrl` (deprecated)
  * `string`

  **Deprecated. Move `afterMultiSessionSingleSignOutUrl` to <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider /></SDKLink>.** The full URL or path to navigate to after signing out from a currently active account in a multi-session app.

  ***

* `afterSignOutUrl` (deprecated)
* `string`

  **Deprecated. Move `afterSignOutUrl` to <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider /></SDKLink>.** The full URL or path to navigate to after a successful sign-out.

  ***

* `afterSwitchSessionUrl`
* `string`

  The full URL or path to navigate to after a successful account change in a multi-session app.

  ***

* `appearance`
* <code><SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Appearance</SDKLink> | undefined</code>

  Optional object to style your components. Will only affect <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Clerk components</SDKLink> and not [Account Portal](/docs/guides/account-portal/overview) pages.

  ***

* `defaultOpen`
* `boolean`

  Controls whether the `<UserButton />` should open by default during the first render.

  ***

* `showName`
* `boolean`

  Controls if the user name is displayed next to the user image button.

  ***

* `signInUrl`
* `string`

  The full URL or path to navigate to when the **Add another account** button is clicked. It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

* `userProfileMode`
* `'modal' | 'navigation'`

  Controls whether selecting the **Manage your account** button will cause the <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component to open as a modal, or if the browser will navigate to the `userProfileUrl` where `<UserProfile />` is mounted as a page. Defaults to: `'modal'`.

  ***

* `userProfileProps`
* `object`

  Specify options for the underlying <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component. For example: `{additionalOAuthScopes: {google: ['foo', 'bar'], github: ['qux']}}`.

  ***

* `userProfileUrl`
* `string`

  The full URL or path leading to the user management interface.

  ***

* `fallback?`
* `ReactNode`

  An optional element to be rendered while the component is mounting.
</Properties>

## Customization

To learn about how to customize Clerk components, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>customization documentation</SDKLink>.

You can also <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>add custom actions and links to the `<UserButton />` menu</SDKLink>.

---

title: "`<UserProfile />` component"
description: Clerk's <UserProfile /> component is used to render a beautiful,
  full-featured account management UI that allows users to manage their profile
  and security settings.
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/reference/components/user/user-profile
lastUpdated: 2025-12-11T21:25:35.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,expressjs,fastify,go,ruby,js-backend
activeSdk: expo
sourceFile: /docs/reference/components/user/user-profile.mdx
---

![The \<UserProfile /> component renders a full-featured account management UI that allows users to manage their profile and security settings.](/docs/images/ui-components/user-profile.png){{ style: { maxWidth: '100%' } }}

The `<UserProfile />` component is used to render a beautiful, full-featured account management UI that allows users to manage their profile, security, and billing settings.

<If sdk={["astro", "chrome-extension", "expo", "nextjs", "nuxt", "react", "react-router", "remix", "tanstack-react-start", "vue"]}>

## Example

  <If sdk="expo">
    > \[!NOTE]
    > This component can be used in Expo Web projects, but it isn't available in native environments (iOS or Android). For native apps, build a custom UI using Clerk hooks. See [custom flows guides](/docs/guides/development/custom-flows/overview) for details.

    ```jsx {{ filename: '/app/user-profile.web.tsx' }}
    import { UserProfile } from '@clerk/clerk-expo/web'

    export default function UserProfilePage() {
      return <UserProfile />
    }
    ```
  </If>
</If>

## Properties

All props are optional.

<Properties>
  * `appearance`
  * <code><SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Appearance</SDKLink> | undefined</code>

  Optional object to style your components. Will only affect <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Clerk components</SDKLink> and not [Account Portal](/docs/guides/account-portal/overview) pages.

  ***

* `routing`
* `'hash' | 'path'`

  The [routing](/docs/guides/how-clerk-works/routing) strategy for your pages. Defaults to `'path'` for frameworks that handle routing, such as Next.js and Remix. Defaults to `hash` for all other SDK's, such as React.

  ***

* `path`
* `string`

  The path where the component is mounted on when `routing` is set to `path`. It is ignored in hash-based routing. For example: `/user-profile`.

  ***

* `additionalOAuthScopes`
* `object`

  Specify additional scopes per OAuth provider that your users would like to provide if not already approved.  For example: `{google: ['foo', 'bar'], github: ['qux']}`.

  ***

* `customPages`
* <code><SDKLink href="/docs/reference/javascript/types/custom-page" sdks={["js-frontend"]}>CustomPage</SDKLink>\[]</code>

  An array of custom pages to add to the user profile. Only available for the <SDKLink href="/docs/reference/javascript/overview" sdks={["js-frontend"]}>JavaScript SDK</SDKLink>. To add custom pages with React-based SDK's, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>dedicated guide</SDKLink>.

  ***

* `fallback?`
* `ReactNode`

  An optional element to be rendered while the component is mounting.
</Properties>

## Customization

To learn about how to customize Clerk components, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>customization documentation</SDKLink>.

In addition, you also can add custom pages and links to the `<UserProfile />` navigation sidenav. For more information, refer to the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>Custom Pages documentation</SDKLink>.
