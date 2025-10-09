<script setup lang="ts">
import { ref, watch } from 'vue'
import FeatherIcon from './FeatherIcon.vue'
import type { Habit } from '@shared/types'
import { getAuthObject } from '@client/lib/auth'
import { insertHabit } from '@client/dexie/dexieQueries'

const emits = defineEmits<{
  'add-habit': [queue_length: number]
}>()

const initialState: Pick<Habit, 'name' | 'description'> = {
  name: '',
  description: null,
}
const formData = ref({ ...initialState })
const dialog = ref<HTMLDialogElement | null>(null)
const open = ref(false)

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
  const user = getAuthObject()
  if (!user) return

  const length = await insertHabit(user.user.id, formData.value)

  emits('add-habit', length)
  closeDialog()
}
</script>

<template>
  <button @click="() => (open = true)">
    <FeatherIcon icon="plus-circle" />
  </button>
  <dialog ref="dialog" @close.prevent="() => (open = false)">
    <form @submit.prevent="addHabit" @reset.prevent="() => (open = false)">
      <h2>Add a new habit</h2>

      <div class="form-group">
        <label for="name">Habit</label>
        <input type="text" name="name" id="habit_name" v-model="formData.name" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          type="text"
          name="description"
          id="habit_description"
          v-model="formData.description"
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

dialog:open::backdrop {
  /* background-color: rgba(0, 0, 0, 0.25); */
  backdrop-filter: blur(8px);
  transition: backdrop-filter 200ms ease-in-out;

  @starting-style {
    backdrop-filter: blur(0);
  }
}

dialog.closing::backdrop {
  /* background-color: rgba(0, 0, 0, 0); */
  backdrop-filter: blur(0);
  transition: backdrop-filter 200ms ease-in-out;

  @starting-style {
    backdrop-filter: blur(8px);
  }
}

dialog:open {
  margin-top: 10dvh;
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
