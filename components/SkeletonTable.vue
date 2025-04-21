<template>
    <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b">
                        <th v-for="header in 4" :key="header" class="px-4 py-2 text-left">
                            <Skeleton width="100%" height="1.5rem" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in 5" :key="i" class="border-b">
                        <td class="flex items-center px-4 py-2 space-x-2">
                            <Skeleton shape="circle" size="2rem" />
                            <Skeleton width="8rem" height="1rem" />
                        </td>
                        <td class="px-4 py-2">
                            <Skeleton width="6rem" height="1rem" />
                        </td>
                        <td class="px-4 py-2">
                            <Skeleton width="5rem" height="1.5rem" class="rounded-full" />
                        </td>
                        <td class="px-4 py-2">
                            <Skeleton width="4rem" height="2rem" class="rounded-md" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
</template>