<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';
const props = defineProps<{ errors: ErrorObject[] }>();
</script>
<template>
    <template>
        <div v-auto-animate class="inline-block">
        <small v-for="prop in props.errors" class="text-red-600">
            {{ prop.$message }}
        </small>
    </div>
    </template>
</template>
<style></style>