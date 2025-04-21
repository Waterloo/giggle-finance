import * as Sentry from "@sentry/nuxt";
Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  dsn: "https://0a58d5a27759f49515b390df6434d6c4@o4508759401234432.ingest.de.sentry.io/4508759403462736",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  
  // If you don't want to use Session Replay, just remove the line below:
  integrations: [Sentry.replayIntegration()],
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  beforeSend(event, hint) {
    console.log({ event, hint });
    if(window.testId){
      event.tags = {
        testId: window.testId
      }
    }
    event.tags = {
      ...event.tags,
      sourceApp: 'deployment-hub'
    }
    return event
  },
});
