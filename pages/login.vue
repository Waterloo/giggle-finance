<template>
    <main class="flex min-h-screen">
        <div
            class="min-h-screen w-[50vw] bg-primary flex flex-col items-center justify-center"
        >
            <img src="~/assets/images/logo.svg" alt="" />
        </div>
        <div
            class="flex flex-col justify-center items-center flex-grow min-w-[40%]"
        >
            <div class="absolute top-0 right-0">
                <!-- <Dropdown
          v-model="selectedLang"
          :options="languages"
          option-label="name"
          class="text-sm border-none"
        /> -->
            </div>

            <form @submit.prevent="loginHandler">
                <h1 class="mb-4 text-3xl font-semibold leading-none">
                    {{ $t("welcome-title") }}
                </h1>
                <p class="mb-6 text-gray-400">
                    {{ $t("welcome-login-message") }}
                </p>

                <div class="flex flex-col gap-2 mb-5">
                    <label for="email" class="font-medium">{{
                        $t("email")
                    }}</label>
                    <InputText
                        id="email"
                        v-model="form.username"
                        class="w-full p-4"
                        aria-describedby="email-help"
                        placeholder="Enter your username"
                        @blur="v$.username.$touch"
                    />
                    <InputError :errors="v$.username.$errors" />
                </div>
                <div class="flex flex-col gap-2 mb-5">
                    <label for="password" class="font-medium">{{
                        $t("password")
                    }}</label>
                    <InputText
                        id="password"
                        v-model="form.password"
                        :type="passwordVisibility"
                        class="p-4"
                        aria-describedby="password-help"
                        placeholder="Enter your password"
                    />
                    <div class="flex justify-between">
                        <InputError :errors="v$.password.$errors" />
                        <a
                            href="#"
                            class="text-sm"
                            @click.prevent="switchPasswordVisibility"
                        >
                            {{
                                passwordVisibility === "password"
                                    ? "show"
                                    : "hide"
                            }}
                            password
                        </a>
                    </div>
                </div>
                <Button
                    label="Login"
                    class="justify-center w-full p-4 font-bold bg-primary"
                    type="submit"
                    :loading="loading"
                    loading-icon="pi pi-spin pi-spinner"
                    :disabled="isLoginDisabled"
                />
            </form>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
// import { useLang } from "~/composables/languages";
import { useToast } from "primevue/usetoast";

const toast = useToast();
definePageMeta({
    layout: "blank",
});

const form = ref({
    username: "",
    password: "",
});

const isLoginDisabled = computed(() => {
    return !form.value.username || !form.value.password;
});

const formRules = {
    username: { required },
    password: { required },
};

const v$ = useVuelidate(formRules, form);
// const { languages, selectedLang } = useLang();

const passwordVisibility = ref<"password" | "text">("password");

function switchPasswordVisibility() {
    passwordVisibility.value =
        passwordVisibility.value === "password" ? "text" : "password";
}

const { login, loading } = useAuth();

const router = useRouter();

async function loginHandler() {
    const result = await v$.value.$validate();
    console.log(result);
    if (!result) return;

    const { username, password } = form.value;
    const { success } = (await login({ email: username, password })) || {};
    console.log({ success });
    if (success) {
        router.push("/attendance-sheet");
    } else {
        console.log("error logging in");
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Invalid username or password",
            life: 3000,
        });
    }
}
</script>
