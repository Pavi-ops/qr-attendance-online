<template>
  <div class="flex flex-col items-center gap-4 p-4 bg-white rounded shadow-md">
    <h2 class="text-xl font-semibold">Scan Student Attendance</h2>
    <p class="text-sm text-gray-600">Align the student QR within the frame to mark attendance</p>
    <div class="scanner-container">
      <div class="video-wrapper">
        <video ref="video" class="video" autoplay></video>
        <div class="overlay">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="scan-line" :class="{ active: scanning }"></div>
          <div v-if="scanSuccessIndicator" class="scan-success-indicator">
            <span class="checkmark">&#10004;</span> 
          </div>
        </div>
      </div>

      <p class="info-text">Align the QR or Barcode within the frame</p>
      
      <button class="done-button" @click="goBack">Done Scanning</button>
      <button class="done-button" @click="Back">Back</button>      
    </div>
  </div>
</template>

<script setup>

import { useUserStore } from '@/stores/user';
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BrowserMultiFormatReader, BarcodeFormat, NotFoundException } from '@zxing/library'
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useNuxtApp } from '#app'

const { $db } = useNuxtApp()

const scanSuccessIndicator = ref(false);
const userStore = useUserStore();
const username = userStore.username;
const video = ref(null)
const scanning = ref(true)
const router = useRouter()
const route = useRoute()

let codeReader;  // Declare codeReader here

const onScanSuccess = async (codeText) => {
  if (!codeText) return;

  try {
    console.log(codeText)
    // 1. Look up student info
    const usersCollection = collection($db, 'user');
    console.log("c1")
    const userQuery = query(usersCollection, where('studentId', '==', codeText));
    console.log("c2")
    const querySnapshot = await getDocs(userQuery);
    console.log("c3")

    if (querySnapshot.empty) {
      alert('Student not found in database.');
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();

    const attendanceDate = new Date();

    // 2. Add attendance record
    await addDoc(collection($db, 'attendance'), {
      studentId: codeText,
      name: user.name,
      email: user.email,
      timestamp: attendanceDate,
      attendedBy: username,
    });

    // 3. Send confirmation email
    const emailContent = `
      Hello ${user.name},<br/><br/>
      Your attendance has been successfully marked on <b>${attendanceDate.toLocaleString()}</b>.<br/><br/>
      Regards,<br/>
    `;

    await fetch('/api/sendEmail', {
      method: 'POST',
      body: JSON.stringify({
        to: user.email,
        subject: 'Attendance Confirmation',
        text: emailContent,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(error => console.error("Email send error:", error));  // Catch any error in email sending

    // 4. Show success
    scanSuccessIndicator.value = true;
    setTimeout(() => (scanSuccessIndicator.value = false), 2000);

  } catch (error) {
    console.error("Error during attendance scan:", error);
    alert("There was a problem recording the attendance.");
  }
};

onMounted(async () => {
  codeReader = new BrowserMultiFormatReader(undefined, {
    possibleFormats: [
      BarcodeFormat.QR_CODE  // You can reduce formats to just QR_CODE if others aren't needed
    ]
  })

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    video.value.srcObject = stream

    codeReader.decodeFromVideoDevice(null, video.value, async (result, err) => {
      if (result && scanning.value) {
        scanning.value = false
        scanSuccessIndicator.value = true;
        setTimeout(() => {
          scanSuccessIndicator.value = false;
        }, 2000);
        await onScanSuccess(result.getText())
        scanning.value = true
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error('Scan error:', err)
      }
    })
  } catch (err) {
    console.error('Camera error:', err)
  }
})

onUnmounted(() => {
  if (codeReader) {
    codeReader.reset()
  }
  if (video.value?.srcObject) {
    video.value.srcObject.getTracks().forEach(track => track.stop())
  }
  video.value.srcObject = null; // Clean up the video stream
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Form and layout styling */
.warranty-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  padding: 2rem;
  color: rgb(255, 255, 255);
}

.form-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  color: rgb(255, 255, 255);
}

input {
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  margin-top: 0.3rem;
  background-color: lightyellow;
  color: rgb(60, 0, 0);
}

/* Scanned Items List */
.scanned-list {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
}

.scanned-list h3 {
  margin-bottom: 0.8rem;
  text-align: center;
}

.scanned-list ul {
  list-style-type: none;
  padding: 0;
}

.scanned-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(72, 1, 1, 0.1);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s;
}

.scanned-list li:hover {
  background: rgba(255, 255, 255, 0.2);
}

.remove-button {
  background: #ff4d4d;
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.remove-button:hover {
  background: #e60000;
}

/* Scanner */
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000;
  padding: 2rem;
  border-radius: 12px;
}

.video-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  border: 2px solid #00ff00;
  overflow: hidden;
  border-radius: 12px;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 4px solid #00ff00;
}

.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #00ff00;
  animation: scan 2s infinite;
}

@keyframes scan {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.info-text {
  color: #00ff00;
  margin-top: 1rem;
}

.done-button {
  margin-top: 2rem;
  padding: 0.7rem 1.2rem;
  background-color: #00ff00;
  color: black;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.done-button:hover {
  background-color: #00cc00;
}

.scan-success-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 255, 0, 0.5);
  padding: 1rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: white;
  animation: fadeOut 2s forwards;
  animation-delay: 1.5s;
}

.checkmark {
  font-size: 3rem;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-container {
  position: relative;
}

.loading-image {
  width: 50px;
  height: auto;
  border-radius: 8px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1.5s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); 
  filter: blur(5px);
  z-index: -1;
}


</style>

