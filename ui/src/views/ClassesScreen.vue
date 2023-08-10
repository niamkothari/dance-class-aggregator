<!-- Displays class schedule with filter/specification options. Messaging feature to talk to admins when you notice incorrect info or want to send helpful info. -->
<template>
    <div class="team-member-page" >
        <h3 v-if="classes.length >= 1">
            <DayList class="list" day="Sunday" :classes="classes.filter((c) => c.day== 'Sunday')"/>
            <DayList class="list" day="Monday" :classes="classes.filter((c) => c.day== 'Monday')"/>
            <DayList class="list" day="Tuesday" :classes="classes.filter((c) => c.day== 'Tuesday')"/>
            <DayList class="list" day="Wednesday" :classes="classes.filter((c) => c.day== 'Wednesday')"/>
            <DayList class="list" day="Thursday" :classes="classes.filter((c) => c.day== 'Thursday')"/> 
            <DayList class="list" day="Friday" :classes="classes.filter((c) => c.day== 'Friday')"/>
            <DayList class="list" day="Saturday" :classes="classes.filter((c) => c.day== 'Saturday')"/>
        </h3>
        <div>
            <span>Know of a class not on this list? Add it here!</span>
            <div><b-button>Add class</b-button></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { Class, Studio } from '../../../server/data'
import DayList from '../components/DayList.vue'

const classes: Ref<Class[]> = ref([])
const studios: Ref<Studio[]> = ref([])

async function refreshClasses() {
    const response = await fetch("/api/classes")
    classes.value = await response.json()
}
onMounted(async() => {
    classes.value = await (await fetch("/api/classes")).json()
    studios.value = await (await fetch("/api/studios")).json()
})

/**
 * FILTER: filter by class.instructor.name, class.studio.name, class.style, class.day for now
 */

</script>
<style>
.team-member-page {
	flex-grow: 1;
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
}

.list {
	min-width: 50px;
	max-width: 14.28%;
    display:inline-table;
}
</style>