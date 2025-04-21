const title = ref("Giggle App");
const subtitle = ref("");
const back = ref("");

export function usePageHeader() {
    
    onBeforeUnmount(() => {
        title.value = "Giggle App";
        subtitle.value = "";
        back.value = "";
    })

    return { title, subtitle, back };
}

useHead({
    title: title,
    titleTemplate: (t) => {
        return t ? `${t} | Giggle App` : "Giggle App";
    },
})