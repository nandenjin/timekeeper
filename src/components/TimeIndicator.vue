<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: number }>();

const timeString = computed(() => {
  const v = Math.abs(props.value);
  const m = Math.floor((v % 3600) / 60);
  const s = v % 60;
  return `${props.value >= 0 ? "" : "-"}${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
});
</script>
<template>
  <div class="time-indicator">{{ timeString }}</div>
</template>

<style scoped lang="scss">
.time-indicator {
  width: 100%;
  color: #fff;
  font-size: 20vw;
  user-select: none;
}
</style>
