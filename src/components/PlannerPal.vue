<template>
  <div class="planner-pal" data-testid="planner-pal">
    <p class="planner-pal__title" data-testid="planner-heading">Planner Pal</p>

    <div
      v-if="loading && !profile"
      class="planner-pal__loading"
      data-testid="loading"
      aria-live="polite"
    >
      Loading profile…
    </div>

    <div
      v-else-if="loadError && !profile"
      class="planner-pal__error planner-pal__error--banner"
      data-testid="load-error"
      role="alert"
    >
      {{ loadError }}
    </div>

    <template v-else-if="profile">
      <div v-if="!editing" class="planner-pal__view" data-testid="view-mode">
        <img
          v-if="profile.avatar"
          class="planner-pal__avatar"
          :src="profile.avatar"
          alt=""
          data-testid="avatar"
        />
        <h2 data-testid="display-name">{{ profile.name }}</h2>
        <p data-testid="display-email">{{ profile.email }}</p>
        <p data-testid="display-bio">{{ profile.bio || '—' }}</p>
        <p class="planner-pal__meta" data-testid="display-created">
          Joined {{ formattedCreated }}
        </p>
        <button
          type="button"
          class="planner-pal__btn planner-pal__btn--primary"
          data-testid="edit-toggle"
          @click="startEdit"
        >
          Edit profile
        </button>
      </div>

      <form
        v-else
        class="planner-pal__form"
        data-testid="edit-mode"
        @submit.prevent="submitForm"
      >
        <div class="planner-pal__field">
          <label for="planner-name">Name</label>
          <input
            id="planner-name"
            v-model.trim="draft.name"
            type="text"
            data-testid="field-name"
            autocomplete="name"
            aria-describedby="planner-name-err"
            :aria-invalid="fieldErrors.name ? 'true' : 'false'"
          >
          <p
            v-if="fieldErrors.name"
            id="planner-name-err"
            class="planner-pal__field-error"
            data-testid="name-error"
            role="alert"
          >
            {{ fieldErrors.name }}
          </p>
        </div>

        <div class="planner-pal__field">
          <label for="planner-email">Email</label>
          <input
            id="planner-email"
            v-model.trim="draft.email"
            type="email"
            data-testid="field-email"
            autocomplete="email"
            aria-describedby="planner-email-err"
            :aria-invalid="fieldErrors.email ? 'true' : 'false'"
          >
          <p
            v-if="fieldErrors.email"
            id="planner-email-err"
            class="planner-pal__field-error"
            data-testid="email-error"
            role="alert"
          >
            {{ fieldErrors.email }}
          </p>
        </div>

        <div class="planner-pal__field">
          <label for="planner-bio">Bio</label>
          <textarea
            id="planner-bio"
            v-model="draft.bio"
            rows="4"
            data-testid="field-bio"
            aria-describedby="planner-bio-err"
            :aria-invalid="fieldErrors.bio ? 'true' : 'false'"
          />
          <p
            v-if="fieldErrors.bio"
            id="planner-bio-err"
            class="planner-pal__field-error"
            data-testid="bio-error"
            role="alert"
          >
            {{ fieldErrors.bio }}
          </p>
        </div>

        <div class="planner-pal__actions">
          <button
            type="submit"
            class="planner-pal__btn planner-pal__btn--primary"
            data-testid="save-btn"
            :disabled="saving"
          >
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
          <button
            type="button"
            class="planner-pal__btn planner-pal__btn--ghost"
            data-testid="cancel-btn"
            :disabled="saving"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>

      <div
        v-if="saveError"
        class="planner-pal__error planner-pal__error--inline"
        data-testid="save-error"
        role="alert"
      >
        {{ saveError }}
      </div>
    </template>
  </div>
</template>

<script>
import { fetchPlannerProfile, savePlannerProfile } from '@/services/plannerPalApi.js'

const BIO_MAX = 500

export default {
  name: 'PlannerPal',
  props: {
    userId: {
      type: Number,
      default: 1,
    },
  },
  emits: ['profile-loaded', 'profile-updated', 'profile-error'],
  data() {
    return {
      profile: null,
      loading: false,
      editing: false,
      draft: { name: '', email: '', bio: '' },
      fieldErrors: {},
      loadError: null,
      saveError: null,
      saving: false,
    }
  },
  computed: {
    formattedCreated() {
      if (!this.profile?.created_at) return ''
      try {
        return new Date(this.profile.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      } catch {
        return this.profile.created_at
      }
    },
  },
  watch: {
    userId: {
      immediate: true,
      handler() {
        this.loadProfile()
      },
    },
  },
  methods: {
    async loadProfile() {
      this.loading = true
      this.loadError = null
      this.saveError = null
      this.profile = null
      this.editing = false
      try {
        const data = await fetchPlannerProfile(this.userId)
        this.profile = data
        this.$emit('profile-loaded', data)
      } catch (e) {
        this.loadError = e.message || 'Could not load profile'
        this.$emit('profile-error', e)
      } finally {
        this.loading = false
      }
    },

    startEdit() {
      this.saveError = null
      this.fieldErrors = {}
      this.draft = {
        name: this.profile.name || '',
        email: this.profile.email || '',
        bio: this.profile.bio || '',
      }
      this.editing = true
    },

    cancelEdit() {
      this.editing = false
      this.fieldErrors = {}
      this.saveError = null
    },

    validate() {
      const errors = {}
      if (!this.draft.name) {
        errors.name = 'Name is required'
      }
      const email = this.draft.email
      if (!email) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email'
      }
      if (this.draft.bio.length > BIO_MAX) {
        errors.bio = `Bio must be ${BIO_MAX} characters or less`
      }
      this.fieldErrors = errors
      return Object.keys(errors).length === 0
    },

    async submitForm() {
      this.saveError = null
      if (!this.validate()) return

      this.saving = true
      try {
        const updated = await savePlannerProfile(this.userId, {
          name: this.draft.name,
          email: this.draft.email,
          bio: this.draft.bio,
        })
        this.profile = { ...this.profile, ...updated }
        this.editing = false
        this.fieldErrors = {}
        this.$emit('profile-updated', this.profile)
      } catch (e) {
        this.saveError = e.message || 'Could not save profile'
        this.$emit('profile-error', e)
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.planner-pal {
  max-width: 28rem;
  margin: 1.5rem auto;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  text-align: left;
  background: #fff;
}

.planner-pal__title {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

.planner-pal__loading {
  color: #64748b;
}

.planner-pal__error {
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
}

.planner-pal__error--inline {
  margin-top: 0.75rem;
}

.planner-pal__avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  object-fit: cover;
  display: block;
  margin-bottom: 0.75rem;
}

.planner-pal__view h2 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
}

.planner-pal__view p {
  margin: 0.25rem 0;
  color: #334155;
  font-size: 0.9375rem;
}

.planner-pal__meta {
  font-size: 0.8125rem;
  color: #64748b;
}

.planner-pal__btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.planner-pal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.planner-pal__btn--primary {
  background: #2563eb;
  color: #fff;
}

.planner-pal__btn--ghost {
  background: #f1f5f9;
  color: #0f172a;
  margin-left: 0.5rem;
}

.planner-pal__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.planner-pal__field label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #334155;
}

.planner-pal__field input,
.planner-pal__field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font: inherit;
}

.planner-pal__field-error {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #b91c1c;
}

.planner-pal__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

@media (max-width: 480px) {
  .planner-pal {
    margin: 1rem 0.5rem;
    padding: 1rem;
  }
}
</style>
