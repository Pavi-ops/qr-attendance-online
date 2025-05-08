<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Reports">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-50 mx-auto">
        <NuxtPage />
        <!-- Date Filters -->
        <div class="flex flex-col items-center">
          <label for="date-filters" class="text-lg font-medium mb-4">Filter by Date</label>
          <div class="flex gap-4">
            <input type="date" v-model="fromDate" class="border border-gray-300 rounded px-4 py-2"
              placeholder="From Date" />
            <input type="date" v-model="toDate" class="border border-gray-300 rounded px-4 py-2"
              placeholder="To Date" />
          </div>
        </div>
        <!-- Dropdown for modules -->
        <div class="flex flex-col items-center mt-6">
          <label for="module-dropdown" class="text-lg font-medium mb-4">Select Module</label>
          <select id="module-dropdown" v-model="selectedModule" class="border border-gray-300 rounded px-4 py-2">
            <option v-for="module in modules" :key="module" :value="module">
              {{ module }}
            </option>
          </select>
        </div>
        <!-- Dropdown for export format -->
        <div class="flex flex-col items-center mt-6">
          <label for="export-format-dropdown" class="text-lg font-medium mb-4">Select Export Format</label>
          <select id="export-format-dropdown" v-model="exportFormat" class="border border-gray-300 rounded px-4 py-2">
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <button type="button" class="mt-4 px-4 py-2 bg-(--ui-color-primary-500) text-white rounded w-full"
          @click="exportData">
          Export
        </button>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script>
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Optional for table formatting

export default {
  data() {
    return {
      modules: [], // Array to store unique module values
      selectedModule: '', // Selected module from the dropdown
      fromDate: '', // Start date for filtering
      toDate: '', // End date for filtering
      exportFormat: 'csv', // Default export format
    };
  },
  methods: {
    async fetchModules() {
      try {
        const db = getFirestore(); // Initialize Firestore
        const summaryCollection = collection(db, 'summary'); // Reference to the 'summary' collection

        // Build query with date filters if provided
        let q = summaryCollection;
        if (this.fromDate && this.toDate) {
          q = query(
            summaryCollection,
            where('attendance_time', '>=', new Date(this.fromDate)),
            where('attendance_time', '<=', new Date(this.toDate))
          );
        }

        const querySnapshot = await getDocs(q);

        // Extract unique module values
        const moduleSet = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.module) {
            moduleSet.add(data.module);
          }
        });

        this.modules = Array.from(moduleSet); // Convert Set to Array
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    },
    async exportData() {
      console.log('Exporting data for module:', this.selectedModule);
      console.log('From date:', this.fromDate);
      console.log('To date:', this.toDate);
      console.log('Export format:', this.exportFormat);

      if (!this.selectedModule) {
        console.error('No module selected for export.');
        return;
      }

      try {
        const db = getFirestore();
        const summaryCollection = collection(db, 'summary');

        // Build query based on selected module and date filters
        let q = query(summaryCollection, where('module', '==', this.selectedModule));
        if (this.fromDate && this.toDate) {
          q = query(
            summaryCollection,
            where('module', '==', this.selectedModule),
            where('attendance_time', '>=', new Date(this.fromDate)),
            where('attendance_time', '<=', new Date(this.toDate))
          );
        }

        const querySnapshot = await getDocs(q);

        // Prepare data for export
        const rows = [['Attendance Time', 'Module', 'User']]; // Header row
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          rows.push([data.attendance_time.toDate().toISOString(), data.module, data.user]);
        });

        if (this.exportFormat === 'csv') {
          // Export as CSV
          const csvContent = rows.map((row) => row.join(',')).join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${this.selectedModule}_attendance.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          console.log('CSV file exported successfully.');
        } else if (this.exportFormat === 'pdf') {
          // Export as PDF
          const doc = new jsPDF();
          doc.text(`Attendance Report for Module: ${this.selectedModule}`, 10, 10);

          // Add table using autoTable
          autoTable(doc, {
            head: [rows[0]], // Header row
            body: rows.slice(1), // Data rows
          });

          // Save the PDF
          doc.save(`${this.selectedModule}_attendance.pdf`);
          console.log('PDF file exported successfully.');
        }
      } catch (error) {
        console.error('Error exporting data:', error);
      }
    },
  },
  watch: {
    // Watch for changes in date filters and refetch modules
    fromDate() {
      this.fetchModules();
    },
    toDate() {
      this.fetchModules();
    },
  },
  mounted() {
    this.fetchModules(); // Fetch modules when the component is mounted
  },
};
</script>