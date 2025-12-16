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
lastUpdated: 2025-12-12T17:44:31.000Z
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
lastUpdated: 2025-12-12T17:44:31.000Z
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
lastUpdated: 2025-12-12T17:44:31.000Z
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
