<template>
  <div class="date-time-picker-display">
    <VueDatePicker
      v-model="selectedDateTime"
      :format="'yyyy/MM/dd HH:mm'"
      placeholder="Data nuo"
    />
  </div>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>

  <div class="date-time-picker-display">
    <VueDatePicker
      v-model="selectedDateTime2"
      :format="'yyyy/MM/dd HH:mm'"
      placeholder="Data iki"
    />
  </div>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
  <v-divider></v-divider>
</template>

<script>
import { ref, computed, watch } from "vue";
import { format } from "date-fns";

export default {
  setup(props, { emit }) {
    const selectedDateTime = ref(null);
    const selectedDateTime2 = ref(null);
    const customFormat = "yyyy/MM/dd HH:mm";

    const formattedDateTime = computed(() => {
      if (selectedDateTime.value) {
        return format(new Date(selectedDateTime.value), customFormat);
      }
      return "";
    });
    const formattedDateTime2 = computed(() => {
      if (selectedDateTime2.value) {
        return format(new Date(selectedDateTime2.value), customFormat);
      }
      return "";
    });

    watch([selectedDateTime, selectedDateTime2], () => {
      const start = selectedDateTime.value
        ? format(new Date(selectedDateTime.value), customFormat)
        : "";
      const end = selectedDateTime2.value
        ? format(new Date(selectedDateTime2.value), customFormat)
        : "";
      emit("update:dates", { start, end });
    });

    return {
      selectedDateTime,
      selectedDateTime2,
      formattedDateTime,
      formattedDateTime2,
      customFormat,
    };
  },
};
</script>

<style scoped>
.date-time-picker-display {
}

.selected-date-time-text {
}
</style>
