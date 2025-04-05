<template>
    <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
        <template #header>
            <UDashboardNavbar title="Manual Attendance Page">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full h-full lg:max-w-2xl mx-auto">
                <NuxtPage />
                <!-- Add PIN input -->
                <div class="flex flex-col items-center justify-center h-full w-fit">
                    <label for="pin-input" class="text-lg font-medium mb-4">Enter 5-Digit PIN</label>
                    <div class="flex gap-2">
                        <input v-for="(digit, index) in pin" :key="index" type="text" maxlength="1"
                            class="border border-gray-300 rounded w-20 aspect-square text-center text-lg" v-model="pin[index]"
                            @input="focusNext(index)" />
                    </div>
                    <!-- Added submit button -->
                    <button type="button" class="mt-4 px-4 py-2 bg-(--ui-color-primary-500) text-white rounded w-full"
                        @click="submitPin">
                        Submit
                    </button>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script>
import Swal from 'sweetalert2';
const toast = useToast()
export default {
    data() {
        return {
            pin: Array(5).fill(''), // Array to hold each digit of the PIN
        };
    },
    methods: {
        focusNext(index) {
            // Automatically focus the next input box when a digit is entered
            if (this.pin[index].length === 1 && index < this.pin.length - 1) {
                this.$refs[`pin-${index + 1}`][0].focus();
            }
        },
        submitPin() {
            // Handle PIN submission; replace with your logic/API call/etc.
            const enteredPin = this.pin.join('');
            console.log('Submitted PIN:', enteredPin);
            toast.add({
                title: 'PIN Submitted',
                description: 'Your PIN has been successfully submitted!',
                icon: 'i-lucide-check',
                color: 'success'
            });

            this.pin = Array(5).fill('');
        },
    },
};
</script>