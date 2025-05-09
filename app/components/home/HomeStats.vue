<script setup lang="ts">
import type { Period, Range, Stat } from '~/types'
import '~/assets/css/home.css'
const { user, userRole, loading } = useFirebaseAuth()
console.log(userRole.value);



const props = defineProps<{
  period: Period
  range: Range
}>()

const dashboardCard = computed(() => {
  if (userRole.value === 'admin') {
    return [
      {
        title: 'Create Profile',
        to: '/createProfile/student',
        icon: 'i-lucide-user-pen',
        image: {
          name: 'images/create-profile.png',
          alt: 'Create Profile',
          width: 50,
          height: 70
        }
      },
      {
        title: 'Add Module',
        to: '/module',
        icon: 'i-lucide-copy-plus',
        image: {
          name: 'images/add-module.jpg',
          alt: 'Add Module',
          width: 50,
          height: 70
        }
      },
      {
        title: 'Attendance View',
        to: 'attendance',
        icon: 'i-lucide-chart-no-axes-combined',
        image: {
          name: 'images/attendance.jpg',
          alt: 'Attendance View',
          width: 50,
          height: 70
        }
      },
      {
        title: 'Add Halls',
        to: '/getting-started/color-mode',
        icon: 'i-lucide-warehouse',
        image: {
          name: 'images/create-profile.png',
          alt: 'Add Halls',
          width: 50,
          height: 70
        }
      }
    ]
  }

  if (userRole.value === 'lecturer') {
    return [
    {
        title: 'Add Module',
        to: '/module',
        icon: 'i-lucide-copy-plus',
        image: {
          name: 'images/add-module.jpg',
          alt: 'Add Module',
          width: 50,
          height: 70
        }
      },
      {
        title: 'Attendance View',
        to: 'attendance',
        icon: 'i-lucide-chart-no-axes-combined',
        image: {
          name: 'images/attendance.jpg',
          alt: 'Attendance View',
          width: 50,
          height: 70
        }
      },
      {
        title: 'Add Halls',
        to: '/getting-started/color-mode',
        icon: 'i-lucide-warehouse',
        image: {
          name: 'images/create-profile.png',
          alt: 'Add Halls',
          width: 50,
          height: 70
        }
      }
    ]
  }

  return []
})

// const dashboardCard = ref([
//   {
//     title: 'Create Profile',
//     to: '/createProfile/student',
//     icon : 'i-lucide-user-pen',
//     image: {
//       name: 'images/create-profile.png',
//       alt: 'Create Profile',
//       width: 50,
//       height: 70
//     }
//   },
//   {
//     title: 'Add Module',
//     to: '/module',
//     icon : 'i-lucide-copy-plus',
//     image: {
//       name: 'images/add-module.jpg',
//       alt: 'Create Profile',
//       width: 50,
//       height: 70
//     }
//   },
//   {
//     title: 'Attendance View',
//     to: 'attendance',
//     icon : 'i-lucide-chart-no-axes-combined',
//     image: {
//       name: 'images/attendance.jpg',
//       alt: 'Create Profile',
//       width: 50,
//       height: 70
//     }
//   },
//   {
//     title: 'Add Halls',
//     to: '/getting-started/color-mode',
//     icon : 'i-lucide-warehouse',
//     image: {
//       name: 'images/create-profile.png',
//       alt: 'Create Profile',
//       width: 50,
//       height: 70
//     }
//   },
// ])

const getImagePath = (imagePath: string) => {
  return imagePath;
};

</script>

<template>
  <UPageGrid class="">
    <UPageCard v-for="(card, index) in dashboardCard" :key="index" :to="card.to">
      <div class="flex" style="justify-content: center;">
        <span class="text-2xl font-semibold text-(--ui-text-highlighted)">
          {{ card.title }}
        </span>
      </div>
      <UPageLogos>
        <UIcon :name="card.icon" class="size-30 shrink-0" />
      </UPageLogos>
    </UPageCard>
  </UPageGrid>
</template>
