<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import QueryBox from "./components/QueryBox.vue";
import TimeIndicator from "./components/TimeIndicator.vue";
import soundPathBell1p from "./assets/bell_1p.mp3";

import {
  TimeSegment,
  getSegIndexByElapsedSec,
  getTotalSec,
  parseQuery,
} from "./lib/query";
import { AudioController } from "./lib/audio";

enum SoundIds {
  BELL_1P = "bell_1p",
}

const audioController = ref(new AudioController());
audioController.value.load(SoundIds.BELL_1P, soundPathBell1p);

const initAudio = () => {
  audioController.value.setupContext();
};
onMounted(() => {
  window.addEventListener("click", initAudio);
});
onUnmounted(() => {
  window.removeEventListener("click", initAudio);
});

const query = ref("");
const segments = computed<TimeSegment[]>(() => parseQuery(query.value));
const total = computed(() => getTotalSec(segments.value));

const showRemaining = ref(true);
const continueAfterZero = ref(false);

/** Current clock time */
const now = ref(0);

/** Time when the timer started */
const startedAt = ref(0);

/** Time when the timer paused. `0` if the timer not paused */
const pausedAt = ref(0);
const running = ref(false);

let timer: ReturnType<typeof setTimeout> | null = null;
onMounted(() => {
  timer = setInterval(() => {
    now.value = Math.floor(Date.now() / 1000);
  }, 1000);
});
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const elapsed = computed(() => {
  if (running.value) {
    return now.value - startedAt.value;
  } else {
    return pausedAt.value - startedAt.value;
  }
});

watch(elapsed, (elapsedValue) => {
  if (elapsedValue >= total.value) {
    if (continueAfterZero.value) {
      // Noop
    } else {
      reset();
    }
  }
});

const currentSegIndex = computed(() =>
  getSegIndexByElapsedSec(elapsed.value, segments.value)
);

watch(currentSegIndex, (index, oldIndex) => {
  if (!running) return;
  if (index < oldIndex) return;
  audioController.value.play(SoundIds.BELL_1P);
});

const reset = () => {
  startedAt.value = 0;
  pausedAt.value = 0;
  running.value = false;
};
</script>

<template>
  {{ currentSegIndex }}
  <QueryBox v-model="query" :disabled="running" />
  <TimeIndicator :value="showRemaining ? total - elapsed : elapsed" />
  <div>
    <button
      @click="
        (startedAt = pausedAt > 0 ? now - (pausedAt - startedAt) : now),
          (running = true)
      "
    >
      Start
    </button>
    <button @click="(pausedAt = running ? now : pausedAt), (running = false)">
      Pause
    </button>
    <button @click="reset">Reset</button>
    <button @click="showRemaining = !showRemaining">
      {{ showRemaining ? "Show Elapsed" : "Show Remaining" }}
    </button>
  </div>
  <div>
    <label
      ><input type="checkbox" v-model="continueAfterZero" /> Continue after
      zero</label
    >
  </div>
</template>

<style scoped></style>
