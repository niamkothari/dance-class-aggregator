<template>
    <div :style="{height: '100vh', display: 'flex', flexDirection: 'column'}">
        <b-navbar toggleable="md" type="dark" :style="{background: 'gray'}" >
            <b-navbar-brand class="app-name">
                <a href="/"><span>Dance Class Aggregator</span></a>
            </b-navbar-brand>
						<b-navbar-toggle target="navbar-toggle-collapse">
							<template #default="{ expanded }">
								<b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
								<b-icon v-else icon="chevron-bar-down"></b-icon>
							</template>
						</b-navbar-toggle>
						<b-collapse id="navbar-toggle-collapse" is-nav>
							<b-navbar-nav>
									<b-nav-item to="/">Home</b-nav-item>
                                    <b-nav-item to="/classes">Classes</b-nav-item>
									<b-nav-item v-if="user?.roles?.includes('administrator')" to="/admin">Admin Console</b-nav-item>
									<b-nav-item v-if="user?.name" @click="logout">Sign out {{user.preferred_username}}</b-nav-item>
									<form id="logoutForm" method="POST" action="/api/logout" />
							</b-navbar-nav>
						</b-collapse>
        </b-navbar>
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import { Administrator } from '../../server/data'

const user = ref({} as any)
const currentRoute = ref("")
provide("user", user)

// onMounted(async() => {
//     user.value = await (await fetch("/api/user")).json()
// })

function logout() {
    (window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}

</script>

<style>
	.app-name a {
			color: black;
	}

	.app-name a:hover{
			color: blue;
			text-decoration: none;
	}

	.nav-link {
			color: rgba(255, 255, 255, 0.5);
	}

	.nav-link:hover{
			color: white !important;
	}

	.selected {
		color: white !important;
	}
</style>