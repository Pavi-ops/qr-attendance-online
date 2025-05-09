<!-- <script setup>
  import { ref } from 'vue'
  import QRCode from 'qrcode'


  const defaultValue = ref(new CalendarDate(2022, 2, 6))
  const productId = ref('')
  const qrCanvas = ref(null)
  const qrGenerated = ref(false)  // Track if QR code is generated
  
  // Function to generate QR code
  const generateQRCode = () => {
    if (productId.value) {
      QRCode.toCanvas(qrCanvas.value, productId.value, { width: 200 }, (err) => {
        if (err) {
          console.error(err)
        } else {
          qrGenerated.value = true  
        }
      })
    }
  }
  
  // Function to download QR code as an image
  const downloadQRCode = () => {
    const canvas = qrCanvas.value
    const dataURL = canvas.toDataURL('image/png')  // Get the QR code as a data URL
  
    const link = document.createElement('a')  // Create an anchor element
    link.href = dataURL  // Set the data URL as the link's href
    link.download = 'qr-code.png'  // Set the file name for download
    link.click()  // Trigger the download
  }
  </script>

  <template>
    <div class="flex flex-col items-center gap-4">
      <input v-model="productId" placeholder="Enter Student ID" class="p-2 border rounded" />
      <input v-model = "session" placeholder="Session details" class="p-2 border rounded" />
      <template>
        <UCalendar :default-value />
       </template>
      <button @click="generateQRCode" class="btn">Generate QR Code</button>
      <canvas ref="qrCanvas"></canvas>
      <button v-if="qrGenerated" @click="downloadQRCode" class="btn">Download QR Code</button>
    </div>
  </template> -->

  <script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { CalendarDate } from '@internationalized/date'

// Data properties
const defaultValue = ref(new CalendarDate(2022, 2, 6))
const selectedDate = ref(null)
const selectedTime = ref('')
const session = ref('')
const productId = ref('')
const qrCanvas = ref(null)
const qrGenerated = ref(false)

// Watchers to auto-update session value when date/time changes
watch([selectedDate, selectedTime], () => {
  if (selectedDate.value && selectedTime.value) {
    const { year, month, day } = selectedDate.value
    session.value = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${selectedTime.value}`
  }
})

// QR Code generation
const generateQRCode = () => {
  if (productId.value) {
    QRCode.toCanvas(qrCanvas.value, productId.value, { width: 200 }, (err) => {
      if (err) {
        console.error(err)
      } else {
        qrGenerated.value = true
      }
    })
  }
}

// QR Code download
const downloadQRCode = () => {
  const canvas = qrCanvas.value
  const dataURL = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataURL
  link.download = 'qr-code.png'
  link.click()
}
</script>
<template>

    <UDashboardPanel id="home">
        <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <!-- <HomeDateRangePicker v-model="range" class="-ms-1" /> -->

          <!-- <HomePeriodSelect v-model="period" :range="range" /> -->
        </template>
      </UDashboardToolbar>
    </template>
        <template #body>
          <div class="flex flex-col items-center gap-6 p-6 bg-gray-100 ">
            <h1 class="text-2xl font-semibold text-gray-800">Student Session QR Generator</h1>
        
            <div class="flex flex-col gap-4 w-full max-w-md">
              <input
                v-model="productId"
                placeholder="Module ID"
                class="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />

              <input
                v-model="session"
                placeholder="Session details"
                readonly
                class="p-3 border border-gray-300 rounded-md bg-gray-100 shadow-sm text-gray-700"
              />
        
              <UCalendar
                v-model="selectedDate"
                :default-value="defaultValue"
                class="w-full"
              />
        
              <input
                type="time"
                v-model="selectedTime"
                class="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
        
              <button
                @click="generateQRCode"
                class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Generate QR Code
              </button>
            </div>
        
            <canvas ref="qrCanvas" class="mt-4" />
        
            <button
              v-if="qrGenerated"
              @click="downloadQRCode"
              class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Download QR Code
            </button>
          </div>
        </template>
    
    </UDashboardPanel>
</template>
