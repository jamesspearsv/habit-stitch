<script setup lang="ts">
import { createHabit } from '@/lib/actions'
import { ref, watch } from 'vue'

const initialState = { habit_name: '' }
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
    }, 250)
  }
}

async function addHabit() {
  if (!dialog.value) return
  const result = await createHabit(formData.value)
  if (result.success) {
    open.value = false
  }
}
</script>

<template>
  <!--
  TODO: Position new habit button
-->
  <button @click="() => (open = true)">New Habit</button>
  <dialog ref="dialog">
    <section class="dialog-section">
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
    </section>
  </dialog>
</template>

<style scoped>
@keyframes dialog-opening {
  from {
    margin-top: 100dvh;
  }
}

@keyframes dialog-closing {
  from {
    margin-top: var(--dialog-margin);
  }
}

dialog {
  border: none;
  border-radius: var(--br-lg) var(--br-lg) 0 0;
  background-color: var(--c-bg);
  padding: var(--sp-lg);
  min-width: 100dvw;
  min-height: 100dvh;
  margin-top: var(--dialog-margin);
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

dialog:open {
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
</style>
