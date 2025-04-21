<template>
  <div ref="containerRef" class="max-w-full">
    <div class="flex justify-between mb-4">
      <div class="inline-flex items-center justify-between px-2">
        <button
          class="flex-shrink-0 p-1 rounded-full hover:bg-gray-200"
          @click="previousPeriod"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          class="w-[20ch] px-2 text-sm font-semibold text-center truncate hover:underline"
          @click="toggleCalendar"
        >
          {{ currentPeriodLabel }}
        </button>
        <button
          class="flex-shrink-0 p-1 rounded-full hover:bg-gray-200"
          @click="nextPeriod"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div class="inline-flex w-auto ml-2">
        <slot name="top-actions"/>
      </div>
    </div>
    <div
      v-auto-animate
      class="flex pb-2 space-x-0.5 overflow-x-auto scrollbar-hide"
    >
      <template v-for="(date, index) in visibleDates" :key="index">
        <div
          v-if="isFirstDayOfMonth(date, index) && index != 0"
          class="text-sm w-[3ch] text-center flex justify-center items-center bg-slate-400"
        >
          <div class="flex-grow text-white rotate-90">{{getMonthName(date)}}</div>
        </div>
        <div
          class="relative py-2 text-center text-gray-500 transition-colors cursor-pointer"
          :style="{ width: `${96 / visibleDates.length}%` }"
          :class="{
            'bg-green-500 text-white': isSelected(date),
            'hover:bg-gray-100': !isSelected(date),
          }"
          @click="selectDate(date)"
        >
          <!-- <div>{{ isFirstDayOfMonth(date, index) && index != 0 ? "May" : "" }}</div> -->
          <div class="text-[10px] uppercase leading-tight">
            {{ getDayName(date) }}
          </div>
          <button class="py-1 text-xs font-medium rounded">
            {{ date.getDate() }}
          </button>
        </div>
      </template>
    </div>
    <Dialog
      v-model:visible="isCalendarVisible"
      modal
      header="Select Date"
      :style="{ width: '350px' }"
    >
      <Calendar v-model="calendarDate" inline @date-select="onCalendarSelect" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import Calendar from "primevue/calendar";
import Dialog from "primevue/dialog";

interface Props {
  startDate?: Date;
  calendar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  startDate: () => new Date(),
});

const selectedDate = defineModel<Date | null>();

const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const isCalendarVisible = ref(false);
const calendarDate = ref<Date | null>(null);

const calculateVisibleDays = computed(() => {
  // const minDayWidth = 50;
  // const calculatedDays = Math.floor(containerWidth.value / minDayWidth);
  return 14;
});

const currentStartDate = ref(new Date(props.startDate));

const visibleDates = computed(() => {
  const dates = [];
  const startDate = new Date(currentStartDate.value);
  for (let i = 0; i < calculateVisibleDays.value; i++) {
    dates.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
});

const currentPeriodLabel = computed(() => {
  if (visibleDates.value.length === 0) {
    return "";
  }
  const firstDate = visibleDates.value[0];
  const lastDate = visibleDates.value[visibleDates.value.length - 1];
  if (firstDate.getMonth() !== lastDate.getMonth()) {
    return `${firstDate.toLocaleString("default", {
      month: "long",
    })} - ${lastDate.toLocaleString("default", { month: "long" })}`;
  }
  return firstDate.toLocaleString("default", { month: "long" });
});

const getDayName = (date: Date) => {
  return date.toLocaleString("default", { weekday: "short" });
};

const getMonthName = (date: Date) => {
  return date.toLocaleString("default", { month: "short" });
};

const isSelected = (date: Date) => {
  return (
    selectedDate.value &&
    date.toDateString() === selectedDate.value.toDateString()
  );
};

const isFirstDayOfMonth = (date: Date, index: number) => {
  if (index === 0) return true;
  const prevDate = visibleDates.value[index - 1];
  return date.getMonth() !== prevDate.getMonth();
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
};

const previousPeriod = () => {
  const newStartDate = new Date(currentStartDate.value);
  newStartDate.setDate(newStartDate.getDate() - calculateVisibleDays.value);
  currentStartDate.value = newStartDate;
};

const nextPeriod = () => {
  const newStartDate = new Date(currentStartDate.value);
  newStartDate.setDate(newStartDate.getDate() + calculateVisibleDays.value);
  currentStartDate.value = newStartDate;
};

const toggleCalendar = () => {
  if (!props.calendar) return;

  isCalendarVisible.value = !isCalendarVisible.value;
  if (isCalendarVisible.value) {
    calendarDate.value = selectedDate.value || currentStartDate.value;
  }
};

const onCalendarSelect = (date: Date) => {
  selectDate(date);
  currentStartDate.value = new Date(date);
  isCalendarVisible.value = false;
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth;
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width;
      }
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }
});

watch(calculateVisibleDays, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const middleDate = new Date(currentStartDate.value);
    middleDate.setDate(middleDate.getDate() + Math.floor(oldValue / 2));
    const newStartDate = new Date(middleDate);
    newStartDate.setDate(newStartDate.getDate() - Math.floor(newValue / 2));
    currentStartDate.value = newStartDate;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
