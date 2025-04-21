<script setup lang="ts">

const staffs = [{
    id: 1,
    name: "Jithin",
    gender: 'M',
    nricNo: "12345678",
    isRegular: false,
    signInOut: "string",
    avatar: "string"
  }]

</script>
<template>
<div>

    <DataTableStaff :staffList="staffs" />
    <h1 class="mb-4">Signature</h1>
    <div class="bg-white">
        <VueSignaturePad width="500px" height="150px" ref="signaturePad" />
    </div>
    <div class="mt-8 text-center">
        <Button>Submit</Button>
    </div>
    

</div>
</template>
<style>

</style>