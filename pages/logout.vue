<script setup lang="ts">
const { logout } = useAuth();

onMounted(() => {
    logout();
});

</script>
<template>
    <div>
        <h1>Logging out...</h1>
    </div>
</template>