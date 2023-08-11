<!-- "Choose your city: New York, Los Angeles, Atlanta, Chicago" -->
<template>
	<div class="home-container">
		<h1 class="header">Welcome to the Dance Class Aggregator</h1>
		<h3 class="header">A resourceful tool for finding the right dance classes for you, wherever you are.</h3>
		<b-button v-if="user?.name == null" href="/api/admin-login" class="my-5">Admin? Sign in</b-button>
		<h4 v-if="user?.name" class="my-5">Hello, {{user.name}}</h4>
		<div class="company-list">
				<h5>Current cities:</h5>
				<div class="logo-container">
					<ul>
						<li>New York</li>
						<li>Los Angeles</li>
						<li>Chicago</li>
						<li>Atlanta</li>
					</ul>
				</div>
		</div>
		<b-button v-if="user?.roles?.includes('administrator')" to="/admin" class="my-5" variant="primary">Admin Console</b-button>
        <b-button to="/classes" class="my-5" variant="primary">See Classes</b-button>
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

ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
}
</style>