import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global test configuration
config.global.stubs = {
  // Stub out components that might cause issues in tests
  'router-link': true,
  'router-view': true
}

// Mock any global APIs if needed
global.vi = vi
