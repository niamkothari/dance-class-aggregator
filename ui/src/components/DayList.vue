<template>
    <div class="list-container my-4">
        <h2 class="list-title">{{ day }}</h2>
        <div class="no-classes" v-if="props.classes.length == 0">No classes today princess</div>
        <div v-if="propsSorted" v-for="c in props.classes">
            <ClassComponent :cls="c"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Class } from '../../../server/data';
import ClassComponent from './ClassComponent.vue';

/**
 *  NEXT STEP: ORDER THE APPEARANCE OF CLASSES ON THE SCHEDULE BY START TIME. IF TIE, ORDER BY EARLIEST END TIME. IF STILL TIE, COIN TOSS.
 * Write a function that takes in the props.classes array and sorts them as written above. Wrap this function in an onMounted call so it's done immediately.
 */

const propsSorted = ref(false)
const filterSet = ref(false)

const props = defineProps<{
    day: string,
    classes: Class[]
}>()

function sortClasses(){
    // extract start time - parse time property for the number - and convert to military time as a number type, then order sequentially
    props.classes.sort(function(c1, c2){return c1.time - c2.time})
    propsSorted.value = true
}
onMounted(sortClasses) 

</script>
<style>
.list-container {
	background: gray;
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 45%;
}

.list-title {
	margin: 0 auto;
	color: black;
    text-align: center;
    font-size: 3vmin;       /** Make more responsive - width not responsive enough */
}
.no-classes {
    font-size: 1rem;
    background: white;
    text-align: center;
}
</style>