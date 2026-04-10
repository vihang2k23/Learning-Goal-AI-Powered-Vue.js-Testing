<template>
  <div id="app">
    <nav class="app-nav" aria-label="Main">
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'home' }]"
        data-testid="nav-home"
        @click="view = 'home'"
      >
        HelloWorld
      </button>
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'planner' }]"
        data-testid="nav-planner-pal"
        @click="view = 'planner'"
      >
        Planner Pal
      </button>
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'userForm' }]"
        data-testid="nav-user-form"
        @click="view = 'userForm'"
      >
        User form
      </button>
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'userProfile' }]"
        data-testid="nav-user-profile"
        @click="view = 'userProfile'"
      >
        User profile
      </button>
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'dataFetcher' }]"
        data-testid="nav-data-fetcher"
        @click="view = 'dataFetcher'"
      >
        Data fetcher
      </button>
    </nav>

    <main class="app-main">
      <HelloWorld
        v-if="view === 'home'"
        msg="Welcome to Vue.js Testing Fundamentals"
      />
      <PlannerPal v-else-if="view === 'planner'" />
      <UserForm v-else-if="view === 'userForm'" />
      <UserProfile v-else-if="view === 'userProfile'" :user="demoUser" />
      <DataFetcher v-else-if="view === 'dataFetcher'" />
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PlannerPal from './components/PlannerPal.vue'
import UserForm from './components/UserForm.vue'
import UserProfile from './components/UserProfile.vue'
import DataFetcher from './components/DataFetcher.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    PlannerPal,
    UserForm,
    UserProfile,
    DataFetcher,
  },
  data() {
    return {
      view: 'home',
      demoUser: {
        id: 1,
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        username: 'demouser',
        status: 'active',
        postsCount: 12,
        followers: 3400,
      },
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 24px;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0 0.75rem;
}

.app-nav__btn {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.875rem;
}

.app-nav__btn--active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}

.app-main {
  text-align: center;
}
</style>
