export default defineNuxtPlugin((nuxtApp) => {

  // @ts-expect-error there is no types for this package
  import('vue-signature-pad').then(({ default: VueSignaturePad }) => {
        nuxtApp.vueApp.use(VueSignaturePad)
      })
})