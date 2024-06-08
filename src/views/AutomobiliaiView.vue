<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <!-- Left Column: Filters -->
          <v-col cols="12" md="3">
            <!-- Vehicle Type Filter -->
            <v-card class="mb-2" outlined>
              <v-select
                label="Vehicle Type*"
                v-model="selectedVehicleType"
                :items="vehicleTypes"
                required
              ></v-select>
            </v-card>

            <!-- Location Filter -->
            <v-card class="mb-2" outlined>
              <v-text-field
                label="Location*"
                v-model="location"
                required
              ></v-text-field>
            </v-card>

            <!-- Date and Time Picker -->
            <DateTimePicker @update:dates="updateDates" />
          </v-col>

          <!-- Right Column: Vehicle Listings -->
          <v-col cols="12" md="9">
            <v-card class="pa-4" outlined>
              <v-row>
                <v-col cols="12">
                  <h2>Automobiliai</h2>
                </v-col>
              </v-row>

              <!-- Vehicle List -->
              <v-row>
                <v-col v-for="vehicle in vehicles" :key="vehicle.id" cols="12">
                  <v-card class="pa-3 mb-2" outlined>
                    <v-row align="center" justify="space-between">
                      <v-col cols="8">
                        <div>
                          <div class="subtitle-1">Name: {{ vehicle.name }}</div>
                          <div class="subtitle-1">Type: {{ vehicle.type }}</div>
                          <div class="subtitle-1">
                            Vieta: {{ vehicle.location }}
                          </div>
                          <div class="subtitle-1">
                            Detalės: {{ vehicle.details }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-end">
                        <v-btn
                          text
                          color="primary"
                          @click="makeReservation(vehicle.id, reservableId)"
                          >Rezervuoti</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
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
  components: {},
  data: () => ({
    selectedVehicleType: "",
    vehicleTypes: ["Sedan", "Hatchback", "SUV"],
    location: "",
    vehicles: [],
    allVehicles: [],
    reservationStartDate: null,
    reservationEndDate: null,
  }),
  created() {
    this.fetchVehicles();
  },
  watch: {
    selectedVehicleType() {
      this.filterVehicles();
    },
    location() {
      this.filterVehicles();
    },
    reservationStartDate() {
      this.fetchVehicles();
    },
    reservationEndDate() {
      this.fetchVehicles();
    },
  },
  methods: {
    fetchVehicles() {
      const params = {
        start_date: this.reservationStartDate,
        end_date: this.reservationEndDate,
      };

      axios
        .get("http://127.0.0.1:8000/api/vehicles", { params })
        .then((response) => {
          this.allVehicles = response.data;
          this.vehicles = response.data;
        })
        .catch((error) => {
          console.error("There was an error fetching the vehicles:", error);
        });
    },
    filterVehicles() {
      this.vehicles = this.allVehicles.filter((vehicle) => {
        const matchesLocation = this.location
          ? vehicle.location.toLowerCase().includes(this.location.toLowerCase())
          : true;
        const matchesType = this.selectedVehicleType
          ? vehicle.type === this.selectedVehicleType
          : true;
        return matchesLocation && matchesType;
      });
    },
    updateDates(dates) {
      this.reservationStartDate = dates.start;
      this.reservationEndDate = dates.end;
      this.fetchVehicles();
    },
    makeReservation(reservableId, reservableType) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to make a reservation.");
        return;
      }

      const reservationData = {
        reservable_id: reservableId,
        reservation_type: "vehicle",
        start_date: this.reservationStartDate,
        end_date: this.reservationEndDate,
        status: "Rezervuota",
      };

      axios
        .post("http://127.0.0.1:8000/api/reservations", reservationData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("Reservation successful");
          this.fetchVehicles();
        })
        .catch((error) => {
          console.error(
            "Error making reservation:",
            error.response ? error.response.data : "An error occurred"
          );
        });
    },
  },
};
</script>
