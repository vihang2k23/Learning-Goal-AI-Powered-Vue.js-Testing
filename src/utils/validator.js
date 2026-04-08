export class EmailValidator {
  static isValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export class UserValidator {
  static validateUser(user) {
    const errors = []

    if (!user.name || user.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    if (!EmailValidator.isValid(user.email)) {
      errors.push('Invalid email format')
    }

    if (user.age && (user.age < 18 || user.age > 120)) {
      errors.push('Age must be between 18 and 120')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export class DateHelper {
  static formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  static isDateInPast(date) {
    return new Date(date) < new Date()
  }

  static getDaysUntil(date) {
    const targetDate = new Date(date)
    const today = new Date()
    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
}
