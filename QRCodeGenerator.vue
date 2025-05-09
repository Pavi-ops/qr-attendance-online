<template>
    <div class="flex flex-col items-center gap-4">
      <input v-model="productId" placeholder="Enter Product ID" class="p-2 border rounded" />
      <button @click="generateQRCode" class="btn">Generate QR Code</button>
      <canvas ref="qrCanvas"></canvas>
      <button v-if="qrGenerated" @click="downloadQRCode" class="btn">Download QR Code</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import QRCode from 'qrcode'
  
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
  