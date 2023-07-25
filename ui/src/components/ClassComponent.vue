<template>
    <div class="task-container mx-3 my-2" :class="{ bdc: isBDC, brickhouse: isBrickhouse, peridance: isPeridance, modega: isModega }">
        {{ convertMilitaryTimetoNormalTime(cls.time) }} {{ cls.name }} with {{ cls.instructor.name }} at {{ cls.studio.name }}
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Class } from '../../../server/data';

const isBDC = ref(false)
const isBrickhouse = ref(false)
const isPeridance = ref(false)
const isModega = ref(false)

const props = defineProps<{ cls: Class }>()

function convertMilitaryTimetoNormalTime(time: number): string {
    if (time == 0) return '12:00am'
    let offset = 0
    if (time >= 1300) offset = Math.round(time / 100)
    const timeToString = time.toString()
    if (timeToString.length == 1) {
        // 12:03am -> 3
        return '12:0' + timeToString + 'am'
    }
    if (timeToString.length == 2) {
        // 12:12am -> 12
        return '12:' + timeToString + 'am'
    }
    if (timeToString.length == 3) {
        return timeToString.charAt(0) + ':' + timeToString.slice(1) + 'am'
    }
    // length is now 4
    if (time < 1200) return timeToString.slice(0, 2) + ':' + timeToString.slice(2) + 'am'
    return (offset-12).toString() + ':' + timeToString.slice(2) + 'pm'
}

let studio_name = props.cls.studio.name
if (studio_name == 'Broadway Dance Center') {
    isBDC.value = true
}
if (studio_name == 'Brickhouse') {
    isBrickhouse.value = true
}
if (studio_name == 'Movers Bodega') {
    isModega.value = true
}
if (studio_name == 'Peridance Center') {
    isPeridance.value = true
}

</script>
<style>
.task-container {
	background: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	max-height: 75px;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 90%;
	padding: 5px 0;
    font-size: 1.75vmin;   /** Make more responsive - width not responsive enough */
    text-align: center;
    color: black;
}
.bdc {
    background: rgb(251, 83, 83);
}
.brickhouse {
    background: yellow;
}
.peridance {
    background: pink;
}
.modega {
    background: lightblue;
}

.task-container:hover {
	color: blue;
}
</style>