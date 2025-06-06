<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Protecting a Next.js React Hook Form with Snipkit

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnipkit%2Fsnipkit-js%2Ftree%2Fmain%2Fexamples%2Fnextjs-react-hook-form&project-name=aj-react-hook-form&repository-name=aj-react-hook-form&developer-id=oac_1GEcKBuKBilVnjToj1QUwdb8&demo-title=Snipkit%20Form%20Protection&demo-description=Next.js%20rate%20limiting%2C%20bot%20protection%2C%20email%20verification%20%26%20form%20protection.&demo-url=https%3A%2F%2Fgithub.com%2Fsnipkit%2Fsnipkit-js%2Ftree%2Fmain%2Fexamples%2Fnextjs-react-hook-form&demo-image=https%3A%2F%2Fapp-snipkit.khulnasoft.com%2Fimg%2Fexample-apps%2Fvercel%2Fdemo-image.jpg&integration-ids=oac_1GEcKBuKBilVnjToj1QUwdb8&external-id=aj-react-hook-form)

This example shows how to protect a Next.js React Hook Form with [Snipkit signup
form protection](https://docs-snipkit.khulnasoft.com/signup-protection/concepts). It uses
[shadcn/ui](https://ui.shadcn.com/) form components to build the [React Hook
Form](https://react-hook-form.com/) with both client and server side validation.

This includes:

- Form handling with [React Hook Form](https://react-hook-form.com/).
- Client-side validation with [Zod](https://zod.dev/).
- Server-side validation with Zod and [Snipkit email
  validation](https://docs-snipkit.khulnasoft.com/email-validation/concepts).
- Server-side email verification with Snipkit to check if the email is from a
  disposable provider and that the domain has a valid MX record.
- [Rate limiting with
  Snipkit](https://docs-snipkit.khulnasoft.com/rate-limiting/quick-start/nextjs) set to 5
  requests over a 10 minute sliding window - a reasonable limit for a signup
  form, but easily configurable.
- [Bot protection with
  Snipkit](https://docs-snipkit.khulnasoft.com/bot-protection/quick-start/nextjs) to stop
  automated clients from submitting the form.

These are all combined using the Snipkit `protectSignup` rule
([docs](https://docs-snipkit.khulnasoft.com/signup-protection/concepts)), but they can also
be used separately on different routes.

## How to use

1. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-react-hook-form
   npm ci
   ```

2. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

3. Start the dev server.

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000`.
5. Submit the form with the example non-existent email to show the errors.
   Submit it more than 5 times to trigger the rate limit.
