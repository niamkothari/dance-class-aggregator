<!-- Displays class schedule with filter/specification options. Messaging feature to talk to admins when you notice incorrect info or want to send helpful info. -->
<template>
    <div class="team-member-page" >
        <h3>
            <DayList class="list" day="Sunday" :classes="classes.filter((c) => c.day== 'Sunday')"/>
            <DayList class="list" day="Monday" :classes="classes.filter((c) => c.day== 'Monday')"/>
            <DayList class="list" day="Tuesday" :classes="classes.filter((c) => c.day== 'Tuesday')"/>
            <DayList class="list" day="Wednesday" :classes="classes.filter((c) => c.day== 'Wednesday')"/>
            <DayList class="list" day="Thursday" :classes="classes.filter((c) => c.day== 'Thursday')"/> 
            <DayList class="list" day="Friday" :classes="classes.filter((c) => c.day== 'Friday')"/>
            <DayList class="list" day="Saturday" :classes="classes.filter((c) => c.day== 'Saturday')"/>
        </h3>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { Class, Studio, Instructor } from '../../../server/data'
import DayList from '../components/DayList.vue'

const classes: Ref<Class[]> = ref([])
const studios: Ref<Studio[]> = ref([])
const instructors: Ref<Instructor[]> = ref([])
const filters = {
    studios: [] as Studio[],
    instructors: [] as Instructor[],
    styles: [] as string[]
}

// create a button "All classes" that calls this function so users can reset page if they've already set filters
async function getAllClasses() {
    const response = await fetch("/api/classes")
    classes.value = await response.json()
}
onMounted(async() => {
    classes.value = await (await fetch("/api/classes")).json()
    studios.value = await (await fetch("/api/studios")).json()
    instructors.value = await (await fetch("/api/instructors")).json()
})

// Called every time a studio is clicked on filter menu
function onStudioFilterChange(val: Studio) {
    const ind = filters.studios.indexOf(val)
    if (ind === -1 ) filters.studios.push(val)
    else {
        filters.studios.splice(ind, 1)
    }
}

// Called every time an instructor is clicked on filter menu
function onInstructorFilterChange(val: Instructor) {
    const ind = filters.instructors.indexOf(val)
    if (ind === -1) filters.instructors.push(val)
    else {
        filters.instructors.splice(ind, 1)
    }
}

// Called every time a style is clicked on filter menu
function onStyleFilterChange(val: string) {
    const ind = filters.styles.indexOf(val)
    if (ind === -1) filters.styles.push(val)
    else {
        filters.styles.splice(ind, 1)
    }
}

async function submitFilters() {
    if (filters.studios.length === 0 && filters.instructors.length === 0 && filters.styles.length === 0) {
        alert("No filters specified")
        return
    }
    classes.value = await (await fetch(
        "/api/filteredClasses",
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            body: JSON.stringify(filters)
        }
    )).json()
}

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