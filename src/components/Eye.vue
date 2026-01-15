<script setup>
// Just make the eyes in CSS and toggle the color with class declarations

// No fussing with extraneous ref variables, those break the simple functioning
// Default is for no eye
const visibility = defineModel('visibility', {type: String, default: 'invis'});
</script>

<template>
    <div class="eye" :class="visibility"></div>
</template>
