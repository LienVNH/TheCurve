# 📱 The Curve – React Native + Expo + Supabase

The Curve is a community app built with React Native, Expo Router (v3), and Supabase, fully developed in TypeScript.
It is designed for people with type 1 diabetes to connect, share experiences, and support each other through posts, chats, and discussion topics.

## Quick start

### Requirements

- Node.js (>=18)
- npm or yarn
- Expo CLI
- Supabase account
- `.env` file with API Keys

### Installation

1. **Clone the repostiory**

````
	git clone https:// TODO
	cd the_curve```

````

2. **Install dependencies**

```
npm install
npm install -g expo-cli


```

> Expo CLI is required to run, build, and manage your Expo project. See: https://docs.expo.dev/workflow/expo-cli/
>
> You also need the **Expo Go** app on your iOS or Android phone to preview the app quickly during development:
>
> - Android: [https://play.google.com/store/apps/details?id=host.exp.exponent]()
> - iOS: [https://apps.apple.com/app/expo-go/id982107779]()

3. **Create a .env file**

```
env
EXPO_PUBLIC_SUPABASE_URL= TODO
EXPO_PUBLIC_SUPABASE_KEY= TODO``

```

> Note: Variables must start with `EXPO_PUBLIC_` for Expo to recognize them.

4. **Start the project**

   ```
   npm run start

   ```

   Scan the QR code using the **Expo Go** app on your phone to preview the app.

## Authentication

Authentication is powered by **Supabase** using email/password.

### Email/Password Login

```ts
// Log in using email and password credentials
await supabase.auth.signInWithPassword({
  email: "email@example.com",
  password: "password123",
});
```

## Useful Scripts

```bash
npm run start     # Start local Expo dev server
npm run build     # Build with EAS (optional)
```

## TODO

- [x] Supabase integration
- [x] Email/password login
- [ ] Google/Facebook login
- [x] Profile screen
- [x] Chat rooms

## Resources

- [https://docs.expo.dev/]()
- [https://expo.github.io/router/docs]()
- [https://supabase.com/docs/guides/with-react-native]()
- [https://supabase.com/docs/reference/javascript/introduction]()
- [https://supabase.com/docs/guides/auth/social-login]()
- [https://docs.expo.dev/guides/environment-variables/]()
