<!-- Admins can add, delete, or adjust classes on the schedule. Eventually scraper will automate this and admins will periodically check in to ensure correctness. -->
<template>
    <div class="home-container">
        <div v-if="notAuthorized === true">
            <h2 class="header">You are not authorized to access this page</h2>
        </div>
        <div v-if="notAuthenticated === true">
            <h2 class="header">You are not signed in</h2>
            <b-button href="/api/admin-login" class="my-5">Sign in to access admin console</b-button>
        </div>
        <div v-if="user?.roles?.includes('administrator')">
            <h1 class="header">Administrator Console</h1>
            <h4 v-if="administrator.value !== null" class="my-5">Hello, {{administrator.name}}</h4>
        </div>
	</div>
</template>
<script setup lang="ts">
import { watch, ref, Ref, inject } from 'vue'
import { Administrator } from '../../../server/data'

const user: Ref<any> = inject("user")!
const administrator: Ref<any> = ref({})
const notAuthenticated = ref(false)
const notAuthorized = ref(false)

async function refresh() {
    if (user.value) {
        const response = await fetch("/api/administrator")
        if (response.status === 401) notAuthenticated.value = true
        if (response.status === 404) notAuthorized.value = true
        administrator.value = await response.json()
    }
}

watch(user, refresh, { immediate: true })
</script>