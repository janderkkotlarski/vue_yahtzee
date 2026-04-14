<script setup>
// Just make the eyes in CSS and toggle the color with class declarations

// Using defineProps is better than defineModel for code purpose clarity
defineProps({
    // Default is for no eye
    visibility: {type: String, default: '_______'},
    inverted: {type: String, default: '______'},
});
</script>

<template>
    <div class="eye" :class="[visibility, inverted]"></div>
</template>
