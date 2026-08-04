<script setup lang="ts">
import { z } from 'zod'
import type { AuthResponse } from '~/types'

const router = useRouter()
const { setToken } = useAuth()

// 1. Schema Zod de validare
const loginSchema = z.object({
  email: z.string().min(1, 'Email-ul este obligatoriu').email('Adresa de email este invalidă'),
  password: z.string().min(6, 'Parola trebuie să conțină minim 6 caractere')
})

type LoginForm = z.infer<typeof loginSchema>

// 2. State formular
const form = ref<LoginForm>({
  email: '',
  password: ''
})

const errors = reactive<Record<keyof LoginForm, string>>({
  email: '',
  password: ''
})

const apiError = ref('')

// 3. Watchers: Curățăm erorile când utilizatorul scrie
watch(() => form.value.email, () => {
  if (errors.email) errors.email = ''
  if (apiError.value) apiError.value = ''
})
watch(() => form.value.password, () => {
  if (errors.password) errors.password = ''
  if (apiError.value) apiError.value = ''
})

const isSubmitting = ref(false)

// 4. Validare & Trimitere
const handleLogin = async () => {
  const result = loginSchema.safeParse(form.value)
  
  if (!result.success) {
    const formattedErrors = result.error.format()
    errors.email = formattedErrors.email?._errors[0] || ''
    errors.password = formattedErrors.password?._errors[0] || ''
    return
  }

  isSubmitting.value = true
  try {
    apiError.value = ''
    const response = await $fetch<AuthResponse>('/api/login', {
      method: 'POST',
      body: {
        username: form.value.email.split('@')[0] || 'student',
        email: form.value.email,
        password: form.value.password
      }
    })

    if (response.token) {
      setToken(response.token)
      router.push('/')
    }
  } catch (err: any) {
    apiError.value = err.data?.statusMessage || err.message || 'Eroare la conectarea la server'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
    <h2 class="text-2xl font-bold mb-6 text-center text-white">Autentificare</h2>
    
    <p v-if="apiError" class="mb-4 text-center text-sm font-medium text-red-500 bg-red-950/50 p-2 rounded-lg border border-red-800">
      {{ apiError }}
    </p>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
        <input 
          v-model="form.email"
          type="text" 
          placeholder="student@adresa.ro"
          class="w-full bg-gray-950 text-white placeholder-gray-600 px-4 py-2 rounded-lg border focus:outline-hidden transition-colors"
          :class="errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-red-600'"
        />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1.5 font-medium">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Parolă</label>
        <input 
          v-model="form.password"
          type="password" 
          placeholder="••••••"
          class="w-full bg-gray-950 text-white placeholder-gray-600 px-4 py-2 rounded-lg border focus:outline-hidden transition-colors"
          :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-red-600'"
        />
        <p v-if="errors.password" class="text-red-500 text-xs mt-1.5 font-medium">{{ errors.password }}</p>
      </div>

      <button
        type="submit" 
        :disabled="isSubmitting"
        class="mt-4 text-white font-semibold py-2.5 rounded-lg transition-all bg-red-600 hover:bg-red-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <template v-if="isSubmitting">
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Se autentifică...</span>
        </template>
        <template v-else>
          <span>Intră în cont</span>
        </template>
      </button>
    </form>
  </div>
</template>
