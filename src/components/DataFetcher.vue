<template>
  <div class="data-fetcher">
    <h2>Data Fetcher</h2>
    
    <div class="controls">
      <input 
        v-model="searchTerm" 
        placeholder="Search users..."
        @input="debouncedSearch"
        class="search-input"
      />
      <select v-model="filterStatus" @change="fetchUsers" class="filter-select">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchUsers" class="retry-btn">Retry</button>
    </div>
    
    <div v-else-if="users.length === 0" class="empty">
      No users found
    </div>
    
    <div v-else class="user-list">
      <div 
        v-for="user in filteredUsers" 
        :key="user.id" 
        class="user-item"
        @click="selectUser(user)"
      >
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <span class="status" :class="user.status">{{ user.status }}</span>
      </div>
    </div>

    <div class="pagination">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es'

export default {
  name: 'DataFetcher',
  
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      searchTerm: '',
      filterStatus: '',
      currentPage: 1,
      totalPages: 1,
      selectedUser: null
    }
  },
  
  computed: {
    filteredUsers() {
      let filtered = this.users
      
      if (this.searchTerm) {
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }
      
      if (this.filterStatus) {
        filtered = filtered.filter(user => user.status === this.filterStatus)
      }
      
      return filtered
    },
    
    hasUsers() {
      return this.users.length > 0
    }
  },
  
  created() {
    this.debouncedSearch = debounce(this.fetchUsers, 300)
    this.fetchUsers()
  },
  
  methods: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams({
          page: this.currentPage,
          search: this.searchTerm,
          status: this.filterStatus
        })
        
        const response = await fetch(`/api/users?${params}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        this.users = data.users
        this.totalPages = data.totalPages
        
        this.$emit('users-loaded', data.users)
      } catch (error) {
        this.error = `Failed to fetch users: ${error.message}`
        this.$emit('fetch-error', error)
      } finally {
        this.loading = false
      }
    },
    
    async createUser(userData) {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to create user: ${response.status}`)
        }
        
        const newUser = await response.json()
        this.users.push(newUser)
        this.$emit('user-created', newUser)
        
        return newUser
      } catch (error) {
        this.error = error.message
        this.$emit('create-error', error)
        throw error
      }
    },
    
    async updateUser(userId, userData) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.status}`)
        }
        
        const updatedUser = await response.json()
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        
        this.$emit('user-updated', updatedUser)
        return updatedUser
      } catch (error) {
        this.error = error.message
        this.$emit('update-error', error)
        throw error
      }
    },
    
    async deleteUser(userId) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`)
        }
        
        this.users = this.users.filter(u => u.id !== userId)
        this.$emit('user-deleted', userId)
      } catch (error) {
        this.error = error.message
        this.$emit('delete-error', error)
        throw error
      }
    },
    
    selectUser(user) {
      this.selectedUser = user
      this.$emit('user-selected', user)
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchUsers()
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchUsers()
      }
    },
    
    resetFilters() {
      this.searchTerm = ''
      this.filterStatus = ''
      this.currentPage = 1
      this.fetchUsers()
    }
  }
}
</script>

<style scoped>
.data-fetcher {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-input {
  flex: 1;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border-radius: 4px;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-list {
  margin: 20px 0;
}

.user-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f8f9fa;
}

.user-item h3 {
  margin: 0 0 5px 0;
}

.user-item p {
  margin: 0 0 5px 0;
  color: #666;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.status.active {
  background-color: #d4edda;
  color: #155724;
}

.status.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}
</style>
