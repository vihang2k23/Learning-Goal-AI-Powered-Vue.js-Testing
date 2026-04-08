<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="increment">Count: {{ count }}</button>
    <p v-if="count > 5">Great job! You clicked more than 5 times!</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
}

button {
  margin: 10px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}

p {
  color: #42b983;
  font-weight: bold;
}
</style>
