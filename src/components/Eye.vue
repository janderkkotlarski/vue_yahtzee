<script setup>
// Just make the eyes in CSS and toggle the color with class declarations

// No fussing with extraneous ref variables, those break the simple functioning
// Default is for no eye
// const visibility = defineModel('visibility', {type: String, default: '_______'});
// const inverted = defineModel('inverted', {type: String, default: '______'});

// Using defineProps is better than defineModel for code purpose clarity
const props = defineProps({
    visibility: {type: String, default: '_______'},
    inverted: {type: String, default: '______'},
});
</script>

<template>
    <div class="eye" :class="[visibility, inverted]"></div>
</template>
