<template>
  <div class="user-profile">
    <div v-if="!user" class="user-profile__missing" data-testid="missing-user">
      No user data
    </div>
    <template v-else>
    <div class="user-info">
      <h2>{{ displayName }}</h2>
      <p class="email">{{ user.email || '—' }}</p>
      <p class="status" :class="statusClass">{{ statusText }}</p>
    </div>
    
    <div class="user-stats">
      <div class="stat">
        <span class="label">Posts:</span>
        <span class="value">{{ user.postsCount ?? 0 }}</span>
      </div>
      <div class="stat">
        <span class="label">Followers:</span>
        <span class="value">{{ formattedFollowers }}</span>
      </div>
    </div>

    <div class="actions">
      <button 
        @click="followUser" 
        :disabled="isFollowing"
        class="follow-btn"
      >
        {{ isFollowing ? 'Following' : 'Follow' }}
      </button>
      
      <button 
        @click="loadUserData"
        :disabled="loading"
        class="refresh-btn"
      >
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    user: {
      type: Object,
      required: true,
      validator: (user) => {
        return user && typeof user.id === 'number' && user.email
      }
    },
    showEmail: {
      type: Boolean,
      default: true
    }
  },
  emits: ['follow', 'user-updated', 'error'],
  
  data() {
    return {
      loading: false,
      error: null,
      isFollowing: false
    }
  },
  
  computed: {
    displayName() {
      if (!this.user) return 'Unknown User'
      if (this.user.firstName && this.user.lastName) {
        return `${this.user.firstName} ${this.user.lastName}`
      }
      return this.user.username || 'Unknown User'
    },
    
    statusText() {
      const statusMap = {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending Verification'
      }
      return statusMap[this.user.status] || 'Unknown'
    },
    
    statusClass() {
      return `status-${this.user.status}`
    },
    
    formattedFollowers() {
      if (!this.user || this.user.followers == null) return '0'
      const f = Number(this.user.followers)
      if (Number.isNaN(f)) return '0'
      if (f >= 1000000) {
        return `${(f / 1000000).toFixed(1)}M`
      }
      if (f >= 1000) {
        return `${(f / 1000).toFixed(1)}K`
      }
      return String(f)
    },
    
    userLevel() {
      const n = Number(this.user?.postsCount) || 0
      if (n >= 100) return 'Expert'
      if (n >= 50) return 'Advanced'
      if (n >= 10) return 'Intermediate'
      return 'Beginner'
    }
  },
  
  methods: {
    async followUser() {
      if (this.isFollowing || !this.user) return
      
      try {
        this.isFollowing = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100))
        
        this.$emit('follow', {
          userId: this.user.id,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        this.error = 'Failed to follow user'
        this.$emit('error', error)
      }
    },
    
    async loadUserData() {
      if (this.loading || !this.user) return
      
      this.loading = true
      this.error = null
      
      try {
        // Simulate API call
        const response = await fetch(`/api/users/${this.user.id}`)
        if (!response.ok) throw new Error('Failed to load user data')
        
        const updatedUser = await response.json()
        this.$emit('user-updated', updatedUser)
      } catch (error) {
        this.error = error.message
        this.$emit('error', error)
      } finally {
        this.loading = false
      }
    },
    
    resetError() {
      this.error = null
    },
    
    getUserSummary() {
      if (!this.user) {
        return { name: 'Unknown User', level: 'Beginner', posts: 0, followers: '0' }
      }
      return {
        name: this.displayName,
        level: this.userLevel,
        posts: this.user.postsCount ?? 0,
        followers: this.formattedFollowers
      }
    }
  },
  
  watch: {
    'user.id'(newId) {
      if (newId) {
        this.resetError()
        this.isFollowing = false
      }
    }
  }
}
</script>

<style scoped>
.user-profile {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  margin: 20px;
}

.user-info h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.email {
  color: #666;
  font-size: 0.9em;
  margin: 4px 0;
}

.status {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  display: inline-block;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.user-stats {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.stat {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.8em;
  color: #666;
}

.value {
  font-weight: bold;
  font-size: 1.1em;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.follow-btn, .refresh-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.follow-btn {
  background-color: #007bff;
  color: white;
}

.follow-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.refresh-btn {
  background-color: #6c757d;
  color: white;
}

.error {
  color: #dc3545;
  margin-top: 10px;
  padding: 8px;
  background-color: #f8d7da;
  border-radius: 4px;
}
</style>
