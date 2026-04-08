<template>
  <div class="counter">
    <h2>Count: {{ count }}</h2>
    <div class="controls">
      <button @click="increment" :disabled="count >= max">
        Increment
      </button>
      <button @click="decrement" :disabled="count <= min">
        Decrement
      </button>
      <button @click="reset">
        Reset
      </button>
    </div>
    <div v-if="showMessage" class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  props: {
    initialCount: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    }
  },
  emits: ['count-changed', 'max-reached', 'min-reached'],
  data() {
    return {
      count: this.initialCount
    }
  },
  computed: {
    showMessage() {
      return this.count === this.max || this.count === this.min
    },
    message() {
      if (this.count === this.max) return 'Maximum reached!'
      if (this.count === this.min) return 'Minimum reached!'
      return ''
    }
  },
  watch: {
    count(newCount, oldCount) {
      this.$emit('count-changed', { new: newCount, old })
      
      if (newCount === this.max) {
        this.$emit('max-reached', newCount)
      }
      if (newCount === this.min) {
        this.$emit('min-reached', newCount)
      }
    }
  },
  methods: {
    increment() {
      if (this.count < this.max) {
        this.count++
      }
    },
    decrement() {
      if (this.count > this.min) {
        this.count--
      }
    },
    reset() {
      this.count = this.initialCount
    }
  }
}
</script>

<style scoped>
.counter {
  text-align: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 300px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 15px 0;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #369870;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f0f9ff;
  color: #0369a1;
  font-weight: bold;
}
</style>
