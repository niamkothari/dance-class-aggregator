<!-- "Choose your city: New York, Los Angeles, Atlanta, Chicago" -->
<template>
	<div class="home-container">
		<h1 class="header">Welcome to the Dance Class Aggregator</h1>
		<h3 class="header">The world's most resourceful tool for finding the right classes for you, wherever you are.</h3>
		<b-button v-if="user?.name == null" href="/api/admin-login" class="my-5">Admin? Sign in with Keycloak</b-button>
		<h4 v-if="user?.name" class="my-5">Hello, {{user.name}}</h4>
		<div class="company-list">
				<h5>Choose a city:</h5>
				<div class="logo-container">
					<div>New York</div>
                    <div>Los Angeles</div>
                    <div>Atlanta</div>
                    <div>Chicago</div>
				</div>
		</div>
		<b-button v-if="user?.roles?.includes('administrator')" to="/admin" class="my-5" variant="primary">Admin Console</b-button>
        <b-button to="/classes" class="my-5" variant="primary">Classes</b-button>
	</div>
</template>
<script setup lang="ts">
import {watch, ref, Ref, inject} from 'vue'

const user: Ref<any> = inject("user")!

</script>

<style>
.home-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.company-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 100%;
	max-height: min-content;
}

.logo-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	max-height: 50%;
}

.logo {
	height: 10vh;
}

.header {
	text-align: center;
}
</style>