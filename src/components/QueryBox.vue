<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  disabled: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", query: string): void;
}>();
</script>

<template>
  <div class="query-box">
    <div class="input">
      <input
        type="text"
        :value="props.modelValue"
        :disabled="props.disabled"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
