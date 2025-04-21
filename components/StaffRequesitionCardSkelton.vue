<template>
      <div class="w-full p-4 mb-6 space-y-4 bg-white rounded-lg shadow-md">
        <div class="flex justify-between">
          <div>
            <Skeleton width="6rem" class="mb-2" />
            <Skeleton width="8rem" height="1.5rem" />
          </div>
          <div>
            <Skeleton width="6rem" class="mb-2" />
            <Skeleton width="2rem" height="1.5rem" />
          </div>
        </div>
        
        <div class="flex justify-between">
          <div>
            <Skeleton width="6rem" class="mb-2" />
            <Skeleton width="5rem" height="1.5rem" class="mr-3"/>
          </div>
          <div>
            <Skeleton width="6rem" class="mb-2" />
            <div class="flex -space-x-2">
              <Skeleton shape="circle" size="2.5rem" v-for="n in 4" :key="n" />
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <Skeleton width="100%" height="2.5rem" class="flex-grow" />
          <Skeleton width="2.5rem" height="2.5rem" />
        </div>
      </div>
</template>