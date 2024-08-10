<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <!-- Left Column: Filters -->
          <v-col cols="12" md="3">
            <!-- Equipment Type Filter -->
            <v-card class="mb-2" outlined>
              <v-select
                label="Equipment Type*"
                v-model="selectedEquipmentType"
                :items="equipmentTypes"
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

          <!-- Right Column: Equipment Listings -->
          <v-col cols="12" md="9">
            <v-card class="pa-4" outlined>
              <v-row>
                <v-col cols="12">
                  <h2>Equipment</h2>
                </v-col>
              </v-row>

              <!-- Equipment List -->
              <v-row>
                <v-col
                  v-for="equipment in equipments"
                  :key="equipment.id"
                  cols="12"
                >
                  <v-card class="pa-3 mb-2" outlined>
                    <v-row align="center" justify="space-between">
                      <v-col cols="8">
                        <div>
                          <div class="subtitle-1">
                            Name: {{ equipment.name }}
                          </div>
                          <div class="subtitle-1">
                            Type: {{ equipment.type }}
                          </div>
                          <div class="subtitle-1">
                            Location: {{ equipment.location }}
                          </div>
                          <div class="subtitle-1">
                            Details: {{ equipment.additional_details }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-end">
                        <v-btn
                          text
                          color="primary"
                          @click="makeReservation(equipment.id, reservableId)"
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
    selectedEquipmentType: "",
    equipmentTypes: ["Stationary Computer", "Desktop Computer", "Projector"],
    location: "",
    equipments: [],
    allEquipments: [],
    reservationStartDate: null,
    reservationEndDate: null,
  }),
  created() {
    this.fetchEquipment();
  },
  watch: {
    selectedEquipmentType() {
      this.filterEquipment();
    },
    location() {
      this.filterEquipment();
    },
    reservationStartDate() {
      this.fetchEquipment();
    },
    reservationEndDate() {
      this.fetchEquipment();
    },
  },
  methods: {
    fetchEquipment() {
      const params = {
        start_date: this.reservationStartDate,
        end_date: this.reservationEndDate,
      };

      axios
        .get("http://127.0.0.1:8000/api/equipment", { params })
        .then((response) => {
          this.allEquipments = response.data;
          this.equipments = response.data;
        })
        .catch((error) => {
          console.error("There was an error fetching the equipment:", error);
        });
    },
    filterEquipment() {
      this.equipments = this.allEquipments.filter((equipment) => {
        const matchesLocation = this.location
          ? equipment.location
              .toLowerCase()
              .includes(this.location.toLowerCase())
          : true;
        const matchesType = this.selectedEquipmentType
          ? equipment.type === this.selectedEquipmentType
          : true;
        return matchesLocation && matchesType;
      });
    },
    updateDates(dates) {
      this.reservationStartDate = dates.start;
      this.reservationEndDate = dates.end;
      this.fetchEquipment();
    },
    makeReservation(reservableId, reservableType) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to make a reservation.");
        return;
      }

      const reservationData = {
        reservable_id: reservableId,
        reservation_type: "equipment",
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
          this.fetchEquipment();
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
