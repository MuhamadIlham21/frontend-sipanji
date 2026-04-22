<template>
  <div>
    <p class="text-sm mb-1" style="color: var(--color-text-muted)">
      Pilih sektor untuk setiap unit yang relevan dengan lokasi pengawasan Anda.
    </p>

    <!-- Info minimal pilih 1 -->
    <div
      class="flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border mb-6"
      style="
        background: var(--color-accent-50);
        border-color: var(--color-accent-100);
        color: var(--color-text-muted);
      "
    >
      <span class="material-icons text-sm" style="color: var(--color-accent-600)">info</span>
      <span>Minimal <strong>satu unit</strong> harus dipilih. Satu sektor per unit.</span>
    </div>

    <!-- ── Grid Dropdown per Kolom ── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="kolom in KOLOM_LOKASI" :key="kolom.id" class="flex flex-col gap-2">
        <!-- Label kolom -->
        <div class="flex items-center justify-between">
          <label
            class="text-sm font-semibold flex items-center gap-1.5"
            style="color: var(--color-text)"
          >
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :class="
                store.formState.lokasi_pengawasan[kolom.id]
                  ? 'bg-primary'
                  : 'bg-[var(--color-text-faint)]'
              "
            />
            {{ kolom.label }}
          </label>

          <!-- Tombol clear per kolom -->
          <button
            v-if="store.formState.lokasi_pengawasan[kolom.id]"
            class="text-xs flex items-center gap-0.5 transition-colors"
            style="color: var(--color-text-faint)"
            @click="store.setLokasi(kolom.id, null)"
          >
            <span class="material-icons text-xs">close</span>
            Hapus
          </button>
        </div>

        <!-- Dropdown wrapper dengan custom chevron -->
        <div class="relative">
          <select
            :value="store.formState.lokasi_pengawasan[kolom.id] || ''"
            class="w-full appearance-none rounded-2xl px-4 py-3 pr-10 text-sm border-2 focus:outline-none transition-all duration-150 cursor-pointer"
            :class="
              store.formState.lokasi_pengawasan[kolom.id]
                ? 'border-primary bg-primary-50 font-medium'
                : 'border-[var(--color-surface-2)] bg-[var(--color-surface)]'
            "
            :style="
              store.formState.lokasi_pengawasan[kolom.id]
                ? 'color: var(--color-primary)'
                : 'color: var(--color-text-faint)'
            "
            @change="handleChange(kolom.id, $event.target.value)"
          >
            <option value="" disabled>— Pilih Sektor —</option>
            <option v-for="baris in BARIS_LOKASI" :key="baris.id" :value="baris.id">
              {{ baris.label }}
            </option>
          </select>

          <!-- Custom chevron icon -->
          <span
            class="material-icons absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xl transition-colors"
            :class="
              store.formState.lokasi_pengawasan[kolom.id]
                ? 'text-primary'
                : 'text-[var(--color-text-faint)]'
            "
          >
            expand_more
          </span>
        </div>

        <!-- Chip konfirmasi pilihan -->
        <Transition name="fade">
          <div
            v-if="store.formState.lokasi_pengawasan[kolom.id]"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style="background: var(--color-primary-50); color: var(--color-primary)"
          >
            <span class="material-icons text-xs">location_on</span>
            <span class="flex-1 truncate">
              {{ getLabelBaris(store.formState.lokasi_pengawasan[kolom.id]) }}
            </span>
            <span
              class="px-1.5 py-0.5 rounded-full text-white text-xs font-bold"
              style="background: var(--color-primary)"
            >
              ✓
            </span>
          </div>
        </Transition>
      </div>
    </div>

    <!-- ── Ringkasan semua pilihan ── -->
    <Transition name="fade">
      <div
        v-if="adaPilihan"
        class="mt-6 rounded-2xl border p-4"
        style="background: var(--color-surface-2); border-color: var(--color-surface-2)"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2"
          style="color: var(--color-text-muted)"
        >
          <span class="material-icons text-sm text-primary">summarize</span>
          Ringkasan Lokasi Terpilih
        </p>
        <div class="flex flex-col gap-2">
          <div
            v-for="kolom in pilihanAktif"
            :key="kolom.id"
            class="flex items-center justify-between text-sm"
          >
            <span style="color: var(--color-text-muted)" class="flex items-center gap-2">
              <span class="material-icons text-xs text-primary">chevron_right</span>
              {{ kolom.label }}
            </span>
            <span
              class="font-semibold text-xs px-2 py-0.5 rounded-full"
              style="background: var(--color-primary-50); color: var(--color-primary)"
            >
              {{ getLabelBaris(store.formState.lokasi_pengawasan[kolom.id]) }}
            </span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Validasi: belum ada pilihan -->
    <Transition name="fade">
      <p
        v-if="showValidasi"
        class="mt-3 text-xs flex items-center gap-1"
        style="color: var(--color-error)"
      >
        <span class="material-icons text-sm">error_outline</span>
        Pilih minimal satu lokasi pengawasan untuk melanjutkan.
      </p>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { KOLOM_LOKASI, BARIS_LOKASI } from '@/data/lokasi-pengawasan'

const store = useMonitoringStore()

// Tampilkan pesan validasi hanya setelah user berinteraksi
const sudahInteraksi = ref(false)

const handleChange = (kolomId, value) => {
  sudahInteraksi.value = true
  // Jika pilih placeholder kosong, clear
  store.setLokasi(kolomId, value || null)
}

const adaPilihan = computed(() =>
  Object.values(store.formState.lokasi_pengawasan).some((v) => v !== null),
)

const showValidasi = computed(() => sudahInteraksi.value && !adaPilihan.value)

// Kolom yang sudah ada pilihannya (untuk ringkasan)
const pilihanAktif = computed(() =>
  KOLOM_LOKASI.filter((k) => store.formState.lokasi_pengawasan[k.id] !== null),
)

const getLabelBaris = (barisId) => BARIS_LOKASI.find((b) => b.id === barisId)?.label || barisId

// Reset interaksi jika semua di-clear
watch(adaPilihan, (val) => {
  if (!val) sudahInteraksi.value = false
})
</script>
