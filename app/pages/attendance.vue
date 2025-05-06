<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Attendance Sessions</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full border">
        <thead>
          <tr class="bg-gray-800 text-white">
            <th class="border px-4 py-2">Session ID</th>
            <th class="border px-4 py-2">Created Date</th>
            <th class="border px-4 py-2">Module</th>
            <th class="border px-4 py-2">Hall</th>
            <th class="border px-4 py-2">PIN</th>
            <th class="border px-4 py-2">Duration</th>
            <th class="border px-4 py-2">Start Time</th>
            <th class="border px-4 py-2">End Time</th>
            <th class="border px-4 py-2">Student Indexes</th>
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.firebaseId">
            <td class="border px-4 py-2 flex items-center gap-2">
              {{ session.id }}
              <button @click="exportSession(session)" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded">Export</button>
            </td>
            <td class="border px-4 py-2">{{ formatDate(session.createdAt) }}</td>
            <td class="border px-4 py-2">{{ session.module }}</td>
            <td class="border px-4 py-2">{{ session.hall }}</td>
            <td class="border px-4 py-2">{{ session.pin }}</td>
            <td class="border px-4 py-2">{{ session.duration }}</td>
            <td class="border px-4 py-2">{{ session.startTime }}</td>
            <td class="border px-4 py-2">{{ calculateEndTime(session.startTime, session.duration) }}</td>
            <td class="border px-4 py-2">{{ session.indexes || '-' }}</td>
            <td class="border px-4 py-2">
              <button @click="deleteSession(session.firebaseId)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB8lrDVNeYDLGoxdhpk7fCgfvJ1bId8fZ0",
  authDomain: "sliit-project-f776c.firebaseapp.com",
  databaseURL: "https://sliit-project-f776c-default-rtdb.firebaseio.com",
  projectId: "sliit-project-f776c",
  storageBucket: "sliit-project-f776c.appspot.com",
  messagingSenderId: "359216845490",
  appId: "1:359216845490:web:b6c522e408ed0a8c196fab"
}

let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

const db = getFirestore(app)
const sessions = ref([])

onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'sessions'))
  sessions.value = snapshot.docs.map((doc, index) => ({
    id: index + 1,
    firebaseId: doc.id,
    ...doc.data()
  }))
})

function formatDate(timestamp) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp.toDate?.() || new Date(timestamp)
  return date.toLocaleString()
}

function calculateEndTime(start, duration) {
  try {
    const [hours, minutes] = start.split(':').map(Number)
    const dur = parseInt(duration)
    const end = new Date(0, 0, 0, hours + dur, minutes)
    return `${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`
  } catch {
    return '-'
  }
}

async function deleteSession(id) {
  await deleteDoc(doc(db, 'sessions', id))
  sessions.value = sessions.value.filter(session => session.firebaseId !== id)
}

function exportSession(session) {
  const content = JSON.stringify(session, null, 2)
  const blob = new Blob([content], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `session-${session.firebaseId}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  text-align: left;
}
</style>






