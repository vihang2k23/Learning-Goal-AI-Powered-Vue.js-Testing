<template>
  <div id="app">
    <nav class="app-nav" aria-label="Main">
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'home' }]"
        data-testid="nav-home"
        @click="view = 'home'"
      >
        Home
      </button>
      <button
        type="button"
        :class="['app-nav__btn', { 'app-nav__btn--active': view === 'planner' }]"
        data-testid="nav-planner-pal"
        @click="view = 'planner'"
      >
        Planner Pal
      </button>
    </nav>

    <main class="app-main">
      <HelloWorld
        v-if="view === 'home'"
        msg="Welcome to Vue.js Testing Fundamentals"
      />
      <PlannerPal v-else />
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PlannerPal from './components/PlannerPal.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    PlannerPal,
  },
  data() {
    return {
      view: 'home',
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
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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
