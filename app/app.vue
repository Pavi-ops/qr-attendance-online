<script setup lang="ts">
const { user, userRole, loading } = useFirebaseAuth()
const router = useRouter()

// Redirect to select-user if not logged in
onMounted(() => {
  if (!loading.value) {
    if (!user.value) {
      router.push('/selectUser');
    } else {
      console.log(userRole.value);
      
      router.push('/');
    }  
  }
})

const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#111827' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

const title = 'Online QR-based Attendance'
const description = ''

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>