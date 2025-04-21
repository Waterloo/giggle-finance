export function useLang() {
    // locales
    const { locale, locales, setLocale } = useI18n()


    const availableLocales = computed(() => {
        return locales.value.filter(i => i.code !== locale.value)
    });
    const selectedLang = ref({ name: 'En', code: 'en' });

    const languages = ref([
        { name: 'En', code: 'en' },
        { name: 'Cn', code: 'cn' },
    ]);

    watch(selectedLang, () => {
        setLocale(selectedLang.value.code)
    })

    return {
        languages,
        selectedLang
    }

}