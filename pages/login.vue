<script setup lang="ts">
import { z } from 'zod'

const router = useRouter()
const supabase = useSupabaseClient()

// Schema Zod de validare
const authSchema = z.object({
  email: z.string().min(1, 'Email-ul este obligatoriu').email('Adresa de email este invalidă'),
  password: z.string().min(6, 'Parola trebuie să conțină minim 6 caractere')
})

type AuthForm = z.infer<typeof authSchema>

// State formular
const form = ref<AuthForm>({
  email: '',
  password: ''
})

const errors = reactive<Record<keyof AuthForm, string>>({
  email: '',
  password: ''
})

const apiError = ref('')
const isSignUp = ref(false)
const isSubmitting = ref(false)
const successMessage = ref('')

// Watchers: Curățăm erorile când utilizatorul scrie
watch(() => form.value.email, () => {
  if (errors.email) errors.email = ''
  if (apiError.value) apiError.value = ''
})
watch(() => form.value.password, () => {
  if (errors.password) errors.password = ''
  if (apiError.value) apiError.value = ''
})

// Toggle Sign In / Sign Up
const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  apiError.value = ''
  successMessage.value = ''
  errors.email = ''
  errors.password = ''
}

// Validare & Trimitere
const handleSubmit = async () => {
  const result = authSchema.safeParse(form.value)
  
  if (!result.success) {
    const formattedErrors = result.error.format()
    errors.email = formattedErrors.email?._errors[0] || ''
    errors.password = formattedErrors.password?._errors[0] || ''
    return
  }

  isSubmitting.value = true
  apiError.value = ''
  successMessage.value = ''
  
  try {
    if (isSignUp.value) {
      const { data, error } = await supabase.auth.signUp({
        email: form.value.email,
        password: form.value.password,
      })
      if (error) throw error
      successMessage.value = 'Cont creat cu succes! Verifică adresa de email (dacă este necesar) sau conectează-te.'
      isSignUp.value = false // Comută înapoi la login
      form.value.password = ''
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.value.email,
        password: form.value.password,
      })
      if (error) throw error
      router.push('/')
    }
  } catch (err: any) {
    apiError.value = err.message || 'A apărut o eroare'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
    <h2 class="text-2xl font-bold mb-6 text-center text-white">
      {{ isSignUp ? 'Creare Cont' : 'Autentificare' }}
    </h2>
    
    <p v-if="apiError" class="mb-4 text-center text-sm font-medium text-red-500 bg-red-950/50 p-2 rounded-lg border border-red-800">
      {{ apiError }}
    </p>

    <p v-if="successMessage" class="mb-4 text-center text-sm font-medium text-green-500 bg-green-950/50 p-2 rounded-lg border border-green-800">
      {{ successMessage }}
    </p>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
        <input 
          v-model="form.email"
          type="text" 
          placeholder="student@adresa.ro"
          class="w-full bg-gray-950 text-white placeholder-gray-600 px-4 py-2 rounded-lg border focus:outline-none transition-colors"
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
          class="w-full bg-gray-950 text-white placeholder-gray-600 px-4 py-2 rounded-lg border focus:outline-none transition-colors"
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
          <span>Se procesează...</span>
        </template>
        <template v-else>
          <span>{{ isSignUp ? 'Creează cont' : 'Intră în cont' }}</span>
        </template>
      </button>

      <div class="text-center mt-2">
        <button 
          type="button" 
          @click="toggleMode" 
          class="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {{ isSignUp ? 'Ai deja cont? Autentifică-te' : 'Nu ai cont? Creează unul' }}
        </button>
      </div>
    </form>
  </div>
</template>
