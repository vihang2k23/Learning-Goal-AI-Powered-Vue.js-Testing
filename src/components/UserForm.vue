<template>
  <form @submit.prevent="handleSubmit" class="user-form">
    <h2>Create User</h2>
    
    <div class="form-group">
      <label for="name">Name:</label>
      <input 
        id="name"
        v-model="formData.name" 
        type="text" 
        required
        class="form-input"
      />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input 
        id="email"
        v-model="formData.email" 
        type="email" 
        required
        class="form-input"
      />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <label for="age">Age:</label>
      <input 
        id="age"
        v-model.number="formData.age" 
        type="number" 
        min="18"
        max="120"
        class="form-input"
      />
      <span v-if="errors.age" class="error">{{ errors.age }}</span>
    </div>

    <div class="form-group">
      <label for="birthdate">Birth Date:</label>
      <input 
        id="birthdate"
        v-model="formData.birthdate" 
        type="date"
        class="form-input"
      />
      <span v-if="formData.birthdate" class="date-info">
        {{ formattedBirthdate }}
        <span v-if="daysUntilBirthday >= 0">
          ({{ daysUntilBirthday }} days until birthday)
        </span>
        <span v-else>
          (Birthday passed this year)
        </span>
      </span>
    </div>

    <button 
      type="submit" 
      :disabled="isSubmitting || !isFormValid"
      class="submit-btn"
    >
      {{ isSubmitting ? 'Creating...' : 'Create User' }}
    </button>

    <div v-if="submitError" class="submit-error">
      {{ submitError }}
    </div>
  </form>
</template>

<script>
import { UserValidator, DateHelper } from '../utils/validator.js'

export default {
  name: 'UserForm',
  
  data() {
    return {
      formData: {
        name: '',
        email: '',
        age: null,
        birthdate: ''
      },
      errors: {},
      isSubmitting: false,
      submitError: null
    }
  },
  
  computed: {
    isFormValid() {
      const validation = UserValidator.validateUser(this.formData)
      return validation.isValid && Object.keys(this.errors).length === 0
    },
    
    formattedBirthdate() {
      if (!this.formData.birthdate) return ''
      return DateHelper.formatDate(this.formData.birthdate)
    },
    
    daysUntilBirthday() {
      if (!this.formData.birthdate) return null
      return DateHelper.getDaysUntil(this.formData.birthdate)
    }
  },
  
  watch: {
    'formData.name'() {
      this.validateField('name')
    },
    
    'formData.email'() {
      this.validateField('email')
    },
    
    'formData.age'() {
      this.validateField('age')
    }
  },
  
  methods: {
    validateField(field) {
      const validation = UserValidator.validateUser(this.formData)
      const fieldErrors = validation.errors.filter(error => 
        error.toLowerCase().includes(field.toLowerCase())
      )
      
      if (fieldErrors.length > 0) {
        this.errors[field] = fieldErrors[0]
      } else {
        delete this.errors[field]
      }
    },
    
    async handleSubmit() {
      if (!this.isFormValid) return
      
      this.isSubmitting = true
      this.submitError = null
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$emit('user-created', { ...this.formData })
        
        // Reset form
        this.formData = {
          name: '',
          email: '',
          age: null,
          birthdate: ''
        }
        this.errors = {}
        
      } catch (error) {
        this.submitError = 'Failed to create user. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.user-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.date-info {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  display: block;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.submit-error {
  color: #dc3545;
  margin-top: 10px;
  padding: 8px;
  background-color: #f8d7da;
  border-radius: 4px;
}
</style>
