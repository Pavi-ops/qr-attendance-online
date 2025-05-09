<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { createUser } = useFirebaseAuth();

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  username: z.string().min(2, 'Too short'),
  password: z.string().min(8, 'Too short'),
  confirmPassword: z.string().min(8, 'Too short')
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
})
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {

    const { email, password } = event.data

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    // Create the user
    const result = await createUser(email, password, "leacture");

    if (result) {
      toast.add({
        title: 'Success',
        description: 'Your account has been created successfully.',
        icon: 'i-lucide-check',
        color: 'success'
      })
      console.log('User created and Firestore updated:', event.data)
    } else {
      toast.add({
        title: 'Error',
        description: 'Failed to create user.',
        icon: 'i-lucide-alert-circle',
        color: 'error'
      })
    }
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

</script>

<template>
  <UForm id="settings" :schema="profileSchema" :state="profile" @submit="onSubmit">
    <UPageCard title="Profile" variant="naked" orientation="horizontal" class="mb-4">
      <UButton form="settings" label="Save changes" color="neutral" type="submit" class="w-fit lg:ms-auto" />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField name="name" label="Name" description="Will appear on receipts, invoices, and other communication."
        required class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.name" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField name="email" label="Email" description="Used to sign in, for email receipts and product updates."
        required class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.email" type="email" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField name="username" label="Username"
        description="Your unique username for logging in and your profile URL." required
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.username" type="username" autocomplete="off" />
      </UFormField>
    </UPageCard>
  </UForm>
  <UForm id="password" :schema="profileSchema" :state="profile" @submit="onSubmit">
    <UPageCard title="Create password"
      description="Create a password to protect your account. This will be used to sign in." variant="naked"
      orientation="horizontal" class="mb-4"></UPageCard>
    <UPageCard variant="subtle">
      <UFormField name="password" label="Password" description="Must be at least 8 characters long." required
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.password" type="password" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField name="confirmPassword" label="Confirm password" description="Please re-enter your password." required
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.confirmPassword" type="password" autocomplete="off" />
      </UFormField>
    </UPageCard>
  </UForm>
</template>