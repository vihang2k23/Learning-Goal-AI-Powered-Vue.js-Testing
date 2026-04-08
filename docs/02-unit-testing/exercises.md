# 🧪 Unit Testing Exercises

## Exercise 1: Basic Component Testing

### 📋 Task: Test a Simple Counter Component

**Component to Test:**
```vue
<template>
  <div class="counter">
    <h2>Count: {{ count }}</h2>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
}
</script>
```

**Requirements:**
- [ ] Test initial count is 0
- [ ] Test increment button increases count
- [ ] Test decrement button decreases count
- [ ] Test reset button sets count to 0
- [ ] Test all buttons emit correct events

**File:** `exercises/counter.test.js`

---

## Exercise 2: Props and Events Testing

### 📋 Task: Test a User Card Component

**Component to Test:**
```vue
<template>
  <div class="user-card" :class="{ active: user.isActive }">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="follow" :disabled="user.isFollowing">
      {{ user.isFollowing ? 'Following' : 'Follow' }}
    </button>
    <button @click="showDetails">View Details</button>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
      validator: (user) => {
        return user.name && user.email
      }
    }
  },
  methods: {
    follow() {
      this.$emit('follow', this.user.id)
    },
    showDetails() {
      this.$emit('show-details', this.user)
    }
  }
}
</script>
```

**Requirements:**
- [ ] Test component renders with user data
- [ ] Test active class is applied correctly
- [ ] Test follow button emits follow event
- [ ] Test show details button emits show-details event
- [ ] Test button text changes based on following status
- [ ] Test prop validation

**File:** `exercises/user-card.test.js`

---

## Exercise 3: Computed Properties

### 📋 Task: Test a Shopping Cart Component

**Component to Test:**
```vue
<template>
  <div class="shopping-cart">
    <h2>Shopping Cart</h2>
    <div v-if="items.length === 0" class="empty">
      Your cart is empty
    </div>
    <div v-else>
      <div v-for="item in items" :key="item.id" class="item">
        <span>{{ item.name }}</span>
        <span>${{ item.price }}</span>
        <span>Qty: {{ item.quantity }}</span>
      </div>
      <div class="total">
        <p>Subtotal: ${{ subtotal }}</p>
        <p>Tax (10%): ${{ tax }}</p>
        <p>Total: ${{ total }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    subtotal() {
      return this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0).toFixed(2)
    },
    tax() {
      return (this.subtotal * 0.1).toFixed(2)
    },
    total() {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2)
    }
  }
}
</script>
```

**Requirements:**
- [ ] Test empty cart message
- [ ] Test subtotal calculation
- [ ] Test tax calculation (10%)
- [ ] Test total calculation
- [ ] Test with multiple items
- [ ] Test with zero quantity items

**File:** `exercises/shopping-cart.test.js`

---

## Exercise 4: Mocking API Calls

### 📋 Task: Test a User Profile Component with API

**Component to Test:**
```vue
<template>
  <div class="user-profile">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="profile">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>Posts: {{ user.posts.length }}</p>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/api/user'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.loadUser()
  },
  methods: {
    async loadUser() {
      this.loading = true
      this.error = null
      
      try {
        this.user = await getUser(1)
      } catch (err) {
        this.error = 'Failed to load user'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

**API Module:**
```javascript
// src/api/user.js
export async function getUser(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error('User not found')
  }
  return response.json()
}
```

**Requirements:**
- [ ] Mock successful API response
- [ ] Test loading state
- [ ] Test user data display
- [ ] Mock API error response
- [ ] Test error state
- [ ] Test component re-renders correctly

**File:** `exercises/user-profile.test.js`

---

## 🎯 Solutions

After completing the exercises, check your solutions against the provided examples in the `solutions/` directory.

### Running Exercises
```bash
# Run all exercises
npm run test exercises/

# Run specific exercise
npm run test exercises/counter.test.js
```

### Success Criteria
- All tests pass
- Tests cover all component functionality
- Tests are well-structured and readable
- Proper mocking is implemented where needed

## 🏆 Challenge

Create a comprehensive test suite for a complex component of your choice that includes:
- Multiple props with validation
- Computed properties
- Event emission
- API integration
- Error handling
- Conditional rendering

This will prepare you for real-world testing scenarios!
