<script setup lang="ts">
import { createHabit } from '@/lib/_actions'
import { ref, watch } from 'vue'
import FeatherIcon from './FeatherIcon.vue'

const initialState = { habit_name: '' }
const formData = ref({ ...initialState })
const dialog = ref<HTMLDialogElement | null>(null)
const open = ref(false)
const emit = defineEmits(['update'])

watch(open, () => {
  if (!dialog.value) return
  if (open.value) {
    dialog.value.showModal()
  } else {
    closeDialog()
    formData.value = { ...initialState }
  }
})

function closeDialog() {
  if (dialog.value) {
    dialog.value.classList.add('closing')
    setTimeout(() => {
      dialog.value?.close()
      dialog.value?.classList.remove('closing')
    }, 200)
  }
}

async function addHabit() {
  if (!dialog.value) return
  const result = await createHabit(formData.value)
  if (result.success) {
    open.value = false
    emit('update')
  }
}
</script>

<template>
  <div class="heading">
    <slot />
    <button @click="() => (open = true)">
      <FeatherIcon icon="plus-circle" />
    </button>
  </div>
  <dialog ref="dialog" @close.prevent="() => (open = false)">
    <form @submit.prevent="addHabit" @reset.prevent="() => (open = false)">
      <h2>Add a new habit</h2>
      <div class="form-group">
        <label for="habit_name">Habit</label>
        <input
          type="text"
          name="habit_name"
          id="habit_name"
          v-model="formData.habit_name"
          required
        />
      </div>
      <div class="form-group">
        <input type="submit" value="Add" class="submit-btn" />
      </div>
      <div class="form-group">
        <input type="reset" class="cancel-btn" value="Cancel" />
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  padding-block: var(--sp-sm);
  z-index: 100;
  background-color: var(--c-bg);
}

@keyframes dialog-opening {
  from {
    margin-top: 100dvh;
  }
}

@keyframes dialog-closing {
  from {
    margin-top: 25dvh;
  }
}

dialog {
  border: none;
  border-radius: var(--br-lg);
  background-color: var(--c-bg);
  padding: var(--sp-lg);
  width: 90dvw;
  margin-inline: auto;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
}

dialog:open {
  margin-top: 25dvh;
  animation-name: dialog-opening;
  animation-duration: 200ms;
  animation-timing-function: ease-in-out;
}

dialog.closing {
  margin-top: 100dvh;
  animation-name: dialog-closing;
  animation-duration: 200ms;
  animation-timing-function: ease-in-out;
}

form {
  display: flex;
  flex-direction: column;
}

.submit-btn,
.cancel-btn,
.add-btn {
  cursor: pointer;
}

.submit-btn {
  background-color: var(--c-secondary);

  &:hover {
    background-color: var(--c-secondary);
  }
}

.cancel-btn {
  background-color: var(--c-danger);

  &:hover {
    background-color: var(--c-danger);
  }
}

.add-btn {
  border-radius: 100%;
  aspect-ratio: 1/1;
  width: 40px;
}

@media screen and (min-width: 768px) {
  dialog {
    width: 50dvw;
  }
}
</style>
