import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://0a58d5a27759f49515b390df6434d6c4@o4508759401234432.ingest.de.sentry.io/4508759403462736",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
