<script setup>
// Just make the eyes in CSS and toggle the color with class declarations

// Using defineProps is better than defineModel for code purpose clarity
// Reminder: defineProps cannot be addressed within functions
defineProps({
    // Default is for no eye
    visibility: {type: String, default: '_______'},
    // Default is for normal color scheme
    inverted: {type: String, default: '______'},
});
</script>

<template>
    <!-- The class determines if an eye is seen and which color it is -->
    <div class="eye" :class="[visibility, inverted]"></div>
</template>
