<script setup lang="ts">
import { useRouter } from 'vue-router'

definePageMeta({layout:"login"})

const router = useRouter()

const selectUserType = (userType: string) => {
  router.push(`/login/${userType}`)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-2xl font-bold mb-6">Select Your Role</h1>
    <div class="space-y-4">
      <button @click="selectUserType('admin')" class="px-6 py-3 bg-blue-600 text-white rounded-md">
        Admin
      </button>
      <button @click="selectUserType('student')" class="px-6 py-3 bg-green-600 text-white rounded-md">
        Student
      </button>
      <button @click="selectUserType('lecturer')" class="px-6 py-3 bg-yellow-600 text-white rounded-md">
        Lecturer
      </button>
    </div>
  </div>
</template>