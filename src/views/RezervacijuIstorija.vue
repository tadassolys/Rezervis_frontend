<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="mb-2" outlined>
          <v-row>
            <v-col cols="12">
              <v-card-title> Mano praėjusios rezervacijos </v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-select
                label="Tipas"
                :items="['Room', 'Equipment', 'Vehicle']"
                v-model="filterType"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                label="Būsena"
                :items="['Rezervuota', 'Reserved']"
                v-model="filterStatus"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Data nuo"
                type="date"
                v-model="filterStartDate"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Data iki"
                type="date"
                v-model="filterEndDate"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-row justify="center" class="mt-5">
          <v-col cols="12">
            <v-card>
              <v-data-table
                :headers="tableHeaders"
                :items="filteredData"
                :items-per-page="10"
                class="elevation-1"
              ></v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pastReservations: [],
      tableHeaders: [
        { text: "Reservable Type", value: "reservable_type_name" },
        { text: "Start Date", value: "start_date" },
        { text: "End Date", value: "end_date" },
        { text: "Status", value: "status" },
      ],
      tableData: [],
      filterType: "",
      filterStatus: "",
      filterStartDate: "",
      filterEndDate: "",
    };
  },
  computed: {
    filteredData() {
      return this.tableData
        .filter((item) => {
          const typeMatch = this.filterType
            ? item.reservable_type_name === this.filterType
            : true;
          const statusMatch = this.filterStatus
            ? item.status === this.filterStatus
            : true;
          const startDateMatch = this.filterStartDate
            ? new Date(item.start_date) >= new Date(this.filterStartDate)
            : true;
          const endDateMatch = this.filterEndDate
            ? new Date(item.end_date) <= new Date(this.filterEndDate)
            : true;

          return typeMatch && statusMatch && startDateMatch && endDateMatch;
        })
        .map((item) => ({
          ...item,
          reservable_type_name: item.reservable_type.split("\\").pop(), 
        }));
    },
  },
  created() {
    this.fetchPastReservations();
  },
  methods: {
    async fetchPastReservations() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/past-reservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.tableData = response.data.map((item) => ({
          ...item,
          reservable_type_name: item.reservable_type.split("\\").pop(), 
        }));
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    },
  },
};
</script>

<style>
.black--text {
  color: #000000 !important;
}
</style>
