<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const fileRef = ref<HTMLInputElement>()

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  username: z.string().min(2, 'Too short'),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  password: z.string().min(8, 'Too short'), 
  confirmPassword: z.string().min(8, 'Too short')
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
  avatar: undefined,
  bio: undefined
})
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {
    const auth = getAuth()
    const db = getFirestore()
    const { email, password } = event.data

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Add user authorization info to Firestore
    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      email: user.email,
      role: 'student'
    })

    toast.add({
      title: 'Success',
      description: 'Your account has been created successfully.',
      icon: 'i-lucide-check',
      color: 'success'
    })
    console.log('User created and Firestore updated:', event.data)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to create user.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    console.error('Error creating user:', error)
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  profile.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="These informations will be displayed publicly."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Name"
        description="Will appear on receipts, invoices, and other communication."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.name"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        description="Used to sign in, for email receipts and product updates."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.email"
          type="email"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="username"
        label="Username"
        description="Your unique username for logging in and your profile URL."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.username"
          type="username"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        label="Avatar"
        description="JPG, GIF or PNG. 1MB Max."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar
            :src="profile.avatar"
            :alt="profile.name"
            size="lg"
          />
          <UButton
            label="Choose"
            color="neutral"
            @click="onFileClick"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          >
        </div>
      </UFormField>
      <USeparator />
      <UFormField
        name="bio"
        label="Bio"
        description="Brief description for your profile. URLs are hyperlinked."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="profile.bio"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
  <UForm
    id="password"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Create password"
      description="Create a password to protect your account. This will be used to sign in."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    ></UPageCard>
    <UPageCard variant="subtle">
      <UFormField
        name="password"
        label="Password"
        description="Must be at least 8 characters long."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.password"
          type="password"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="confirmPassword"
        label="Confirm password"
        description="Please re-enter your password."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.confirmPassword"
          type="password"
          autocomplete="off"
        />
      </UFormField>
      </UPageCard>
  </UForm>
</template>