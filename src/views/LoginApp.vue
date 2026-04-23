<template>
  <div class="min-h-screen bg-background text-text flex items-center justify-center p-4">
    <!-- Toast Notification -->
    <!-- <Transition name="slide-fade">
      <div v-if="authStore.isLoading || authStore.message" class="fixed top-6 right-6 z-50">
        <div
          class="flex items-center w-full max-w-sm p-4 bg-surface rounded-xl shadow-lg border border-surface-2 gap-3"
          role="alert"
        >
          <div
            class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            :class="authStore.success ? 'bg-success/10' : 'bg-error/10'"
          >
            <span
              class="material-icons text-xl"
              :class="authStore.success ? 'text-success' : 'text-error'"
            >
              {{ authStore.success ? 'check_circle' : 'error' }}
            </span>
          </div>

          <div class="flex-1 text-sm font-medium text-text">{{ authStore.message }}</div>

          <button
            type="button"
            class="shrink-0 text-text-faint hover:text-text-muted rounded-lg p-1.5 hover:bg-surface-2 transition-colors"
            @click="hideToast"
            aria-label="Tutup notifikasi"
          >
            <span class="material-icons text-lg">close</span>
          </button>
        </div>
      </div>
    </Transition> -->

    <Transition name="slide-fade">
      <div v-if="authStore.isLoading && !authStore.message" class="fixed top-6 right-6 z-50">
        <div
          class="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl shadow-lg border border-surface-2"
        >
          <svg class="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          <span class="text-sm font-medium text-text-muted">Memproses...</span>
        </div>
      </div>
    </Transition>

    <Transition name="slide-fade">
      <div v-if="!authStore.isLoading && authStore.message" class="fixed top-6 right-6 z-50">
        <div
          class="flex items-center w-full max-w-sm p-4 bg-surface rounded-xl shadow-lg border border-surface-2 gap-3"
          role="alert"
        >
          <div
            class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            :class="authStore.success ? 'bg-success/10' : 'bg-error/10'"
          >
            <span
              class="material-icons text-xl"
              :class="authStore.success ? 'text-success' : 'text-error'"
            >
              {{ authStore.success ? 'check_circle' : 'error' }}
            </span>
          </div>
          <div class="flex-1 text-sm font-medium text-text">{{ authStore.message }}</div>
          <button
            type="button"
            class="shrink-0 text-text-faint hover:text-text-muted rounded-lg p-1.5 hover:bg-surface-2 transition-colors"
            @click="hideToast"
            aria-label="Tutup notifikasi"
          >
            <span class="material-icons text-lg">close</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Login Card -->
    <div class="w-full max-w-6xl bg-surface shadow-xl rounded-2xl overflow-hidden">
      <div class="flex flex-col lg:flex-row">
        <!-- ==========================================
             LEFT SIDE — Login Form
             ========================================== -->
        <div class="w-full lg:w-1/2 p-8 sm:p-12">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3 mb-8">
            <img :src="logoURL" class="w-20 h-20" alt="Logo SiPanji" />
            <div>
              <h1 class="text-xl font-bold text-text">SiPanji</h1>
              <p class="text-sm text-text-muted">Sistem Pengendalian Operasional Haji</p>
            </div>
          </div>

          <!-- Welcome Text -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-text mb-2">Selamat Datang</h2>
            <p class="text-text-muted">Silakan masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <!-- Login Form -->
          <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
            <div class="space-y-5">
              <!-- Username Field -->
              <div>
                <label for="username" class="block text-sm font-medium text-text-muted mb-2">
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  id="username"
                  class="w-full px-4 py-3 rounded-lg border bg-surface text-text transition-all duration-200 outline-none"
                  :class="
                    errors.username
                      ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                      : 'border-surface-2 focus:border-primary focus:ring-1 focus:ring-primary'
                  "
                  placeholder="Masukkan username"
                />
                <Transition name="fade">
                  <p
                    v-if="errors.username"
                    class="mt-1.5 text-xs text-error flex items-center gap-1"
                  >
                    <span class="material-icons text-sm">error</span>
                    {{ errors.username }}
                  </p>
                </Transition>
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-text-muted mb-2">
                  Password
                </label>
                <div class="relative">
                  <Field
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="w-full px-4 py-3 rounded-lg border bg-surface text-text transition-all duration-200 pr-12 outline-none"
                    :class="
                      errors.password
                        ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                        : 'border-surface-2 focus:border-primary focus:ring-1 focus:ring-primary'
                    "
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
                    :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  >
                    <span class="material-icons text-xl">
                      {{ showPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
                <Transition name="fade">
                  <p
                    v-if="errors.password"
                    class="mt-1.5 text-xs text-error flex items-center gap-1"
                  >
                    <span class="material-icons text-sm">error</span>
                    {{ errors.password }}
                  </p>
                </Transition>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" class="w-4 h-4 rounded border-surface-2 accent-primary" />
                  <span class="text-sm text-text-muted group-hover:text-text transition-colors">
                    Ingat saya
                  </span>
                </label>
                <a
                  href="#"
                  class="text-sm font-medium text-primary hover:text-primary-700 transition-colors"
                >
                  Lupa password?
                </a>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3.5 rounded-lg font-semibold text-text-inverse bg-primary hover:bg-primary-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="authStore.isLoading"
              >
                <svg
                  v-if="authStore.isLoading"
                  class="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                <span>{{ authStore.isLoading ? 'Memproses...' : 'Masuk' }}</span>
              </button>
            </div>
          </Form>

          <!-- Footer Links -->
          <p class="mt-8 text-xs text-center text-text-faint">
            Dengan masuk, Anda menyetujui
            <a href="#" class="text-primary hover:text-primary-700 font-medium transition-colors">
              Syarat &amp; Ketentuan
            </a>
            dan
            <a href="#" class="text-primary hover:text-primary-700 font-medium transition-colors">
              Kebijakan Privasi
            </a>
          </p>
        </div>

        <!-- ==========================================
             RIGHT SIDE — Illustration / Info
             ========================================== -->
        <div
          class="hidden lg:flex lg:w-1/2 bg-primary p-12 items-center justify-center relative overflow-hidden"
        >
          <!-- Decorative circles -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"
          ></div>

          <!-- Accent strip top -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-accent"></div>

          <!-- Content -->
          <div class="relative z-10 text-text-inverse text-center max-w-md">
            <div class="flex items-center justify-center mb-6">
              <img :src="logoURL" class="w-32 h-32 drop-shadow-lg" alt="Logo SiPanji" />
            </div>
            <h3 class="text-3xl font-bold mb-4 leading-snug">
              Sistem Pengendalian Operasional Haji
            </h3>
            <p class="text-base text-primary-200 mb-8">
              Aplikasi resmi untuk mendukung proses operasional, verifikasi, dan pengendalian
              penyelenggaraan ibadah haji.
            </p>

            <!-- Feature list -->
            <div class="space-y-3 text-left">
              <div class="flex items-start gap-3">
                <span class="material-icons text-accent mt-0.5">check_circle</span>
                <span class="text-primary-100 text-sm">
                  Digunakan khusus oleh petugas operasional haji
                </span>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-icons text-accent mt-0.5">check_circle</span>
                <span class="text-primary-100 text-sm">
                  Mendukung proses persetujuan dan verifikasi berjenjang
                </span>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-icons text-accent mt-0.5">check_circle</span>
                <span class="text-primary-100 text-sm">
                  Keamanan data terjamin dan aktivitas tercatat
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import logoURL from '@/assets/logo.png'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const showPassword = ref(false)

const schema = Yup.object().shape({
  username: Yup.string().required('Username wajib diisi'),
  password: Yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi'),
})

// ==========================================
// SUBMIT HANDLER
// ==========================================
const onSubmit = async (values) => {
  const { username, password } = values
  const result = await authStore.login({ username, password })

  if (result.success) {
    console.clear()
    const redirectTo = route.query.redirect || { name: 'dashboard' }
    setTimeout(() => {
      router.replace(redirectTo)
    }, 500)
  }
}

// ==========================================
// HIDE TOAST
// ==========================================
const hideToast = () => {
  authStore.message = ''
  authStore.success = null
}
</script>
