<template>
    <div>
        <div>Welcome to Dance Class Aggregator</div>
        <div @click="getJaviClass()">Click to see Sam Javi's next class in the browser console</div>
    </div>
</template>
<script setup lang="ts">

async function getJaviClass() {
    const response = await fetch("/api/class")
    const data = await response.json()
    console.log("Javi data received")
    console.log(data.name)
}
</script>