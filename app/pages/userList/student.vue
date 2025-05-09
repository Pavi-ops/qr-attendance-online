<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { ref, onMounted } from 'vue'
import type { FirebaseApp } from 'firebase/app'
import { collection, getDocs } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { getFirestore } from 'firebase/firestore'

const { $firebase } = useNuxtApp()
const db = getFirestore($firebase as FirebaseApp)
const toast = useToast()

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// Define Lecturer type
type Student = {
  name: string
  email: string
  role: string
  studentId: string
}

// Reactive state
const data = ref<Student[]>([])
const table = useTemplateRef('table')

// Fetch lecturers from Firebase
const fetchLecturers = async () => {
  data.value = []
  const querySnapshot = await getDocs(collection(db, 'users'))
  querySnapshot.forEach(docSnap => {
    const user = docSnap.data()
    console.log(user);

    if (user.role === 'student') {
      data.value.push({
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        role: user.role,
        studentId: user.studentId
      })
    }
  })
  data.value.push({ name: "piyumi", email: "piyumi@wewe.com", role: "student", studentId: "2372637" })
  console.log(data);

}

onMounted(() => {
  fetchLecturers()
})

// Table columns
const columns: TableColumn<Student>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      return (table.getSortedRowModel().rows.indexOf(row) + 1).toString()
    },
    enableSorting: false
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email'))
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) =>
      h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color: row.getValue('role') === 'student' ? 'success' : 'neutral'
      }, () => row.getValue('role'))
  },
  {
    accessorKey: 'studentId',
    header: 'StudentId',
    cell: ({ row }) => row.getValue('studentId')
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const items = [
        { type: 'label', label: 'Actions' },
        {
          label: 'Copy Student ID',
          onSelect() {
            navigator.clipboard.writeText(row.original.studentId)
            toast.add({
              title: 'Student ID copied to clipboard!',
              color: 'success',
              icon: 'i-lucide-circle-check'
            })
          }
        },
        {
          label: row.getIsExpanded() ? 'Collapse' : 'Expand',
          onSelect() {
            row.toggleExpanded()
          }
        }
      ]

      return h('div', { class: 'text-right' }, h(UDropdownMenu, {
        content: { align: 'end' },
        items,
        'aria-label': 'Actions dropdown'
      }, () =>
        h(UButton, {
          icon: 'i-lucide-ellipsis-vertical',
          color: 'neutral',
          variant: 'ghost',
          class: 'ml-auto',
          'aria-label': 'Actions dropdown'
        })
      ))
    }
  }
]

// Optional: randomize rows for testing/demo
function randomize() {
  data.value = [...data.value].sort(() => Math.random() - 0.5)
}
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex items-start gap-1 px-6 py-3.5 overflow-x-auto">
      <UInput :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]" placeholder="Filter emails..."
        @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)" />

      <UButton color="neutral" label="Randomize" @click="randomize" />

      <UDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
        label: upperFirst(column.id),
        type: 'checkbox' as const,
        checked: column.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
        },
        onSelect(e?: Event) {
          e?.preventDefault()
        }
      }))" :content="{ align: 'end' }">
        <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" class="ml-auto"
          aria-label="Columns select dropdown" />
      </UDropdownMenu>
    </div>

    <UTable v-if="data.length" ref="table" :data="data" :columns="columns" sticky class="h-96 min-w-[1000px]">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>

    <div class="px-4 py-3.5 text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div>
  </div>
</template>