<template>
  <div style="padding: 40px; background-color: #121212; color: white; min-height: 100vh;">
    <h2>Add Module</h2>
    <input v-model="newModuleCode" placeholder="Module Code" style="margin-bottom: 10px; padding: 10px; width: 100%; border: 1px solid white; border-radius: 5px;" />
    <input v-model="newModuleName" placeholder="Module Name" style="margin-bottom: 10px; padding: 10px; width: 100%; border: 1px solid white; border-radius: 5px;" />
    <button @click="addModule" style="background-color: #28a745; padding: 10px 20px; border: none; border-radius: 5px; color: white;">Add</button>

    <div style="margin-top: 40px;">
      <h2>Existing Modules</h2>
      <div v-for="(module, index) in modules" :key="index" style="border: 1px solid white; border-radius: 5px; padding: 15px; margin-bottom: 10px;">
        <strong>{{ module.code }} - {{ module.name }}</strong>
        <div style="margin-top: 10px;">
          <button @click="editModule(index)" style="margin-right: 10px; padding: 5px 10px; border: none; background-color: #007bff; color: white; border-radius: 4px;">Edit</button>
          <button @click="deleteModule(index)" style="padding: 5px 10px; border: none; background-color: #dc3545; color: white; border-radius: 4px;">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'
const { $firebase } = useNuxtApp()
import { getFirestore } from 'firebase/firestore'

const db = getFirestore($firebase)
const modules = ref([])
const newModuleCode = ref('')
const newModuleName = ref('')
const editingIndex = ref(null)

const fetchModules = async () => {
  modules.value = []
  const querySnapshot = await getDocs(collection(db, 'modules'))
  querySnapshot.forEach(docSnap => {
    modules.value.push({ id: docSnap.id, ...docSnap.data() })
  })
}

const addModule = async () => {
  if (!newModuleCode.value || !newModuleName.value) return alert('Both fields are required')
  if (editingIndex.value !== null) {
    const moduleRef = doc(db, 'modules', modules.value[editingIndex.value].id)
    await updateDoc(moduleRef, {
      code: newModuleCode.value,
      name: newModuleName.value
    })
    editingIndex.value = null
  } else {
    await addDoc(collection(db, 'modules'), {
      code: newModuleCode.value,
      name: newModuleName.value
    })
  }
  newModuleCode.value = ''
  newModuleName.value = ''
  fetchModules()
}

const editModule = (index) => {
  editingIndex.value = index
  newModuleCode.value = modules.value[index].code
  newModuleName.value = modules.value[index].name
}

const deleteModule = async (index) => {
  const moduleRef = doc(db, 'modules', modules.value[index].id)
  await deleteDoc(moduleRef)
  fetchModules()
}

onMounted(() => {
  fetchModules()
})
</script>

