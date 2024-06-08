<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <!-- Left Side -->
          <v-col cols="12" md="3">
            <!-- Type Selection -->
            <v-card class="mb-2" outlined>
              <v-select
                label="Type*"
                v-model="selectedRoomType"
                :items="roomTypes"
              ></v-select>
            </v-card>

            <!-- Location -->
            <v-card class="mb-2" outlined>
              <v-text-field label="Location*" v-model="location"></v-text-field>
            </v-card>

            <!-- Date and Time Picker -->
            <DateTimePicker @update:dates="updateDates" />

            <!-- Additional Requirements -->
            <v-card outlined>
              <v-select
                label="Additional Requirements"
                v-model="additionalNeeds"
                :items="needs"
                multiple
                chips
                small-chips
              ></v-select>
            </v-card>
          </v-col>

          <!-- Right Side -->
          <v-col cols="12" md="9">
            <v-card class="pa-4" outlined>
              <v-row>
                <v-col cols="12">
                  <h2>Search Results</h2>
                  <v-select
                    label="Sort By"
                    v-model="selectedSort"
                    :items="sortOptions"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Results -->
              <v-row>
                <v-col v-for="item in allItems" :key="item.id" cols="12">
                  <v-card class="pa-3 mb-2" outlined>
                    <v-row align="center" justify="space-between">
                      <v-col cols="8" class="d-flex align-center">
                        <div>
                          <strong>{{ item.type }}:</strong> {{ item.name }} -
                          {{ item.location }}
                          <span v-if="item.details">({{ item.details }})</span>
                        </div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-end align-center">
                        <v-btn
                          text
                          color="primary"
                          @click="makeReservation(item.id, item.type)"
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
  data() {
    return {
      selectedRoomType: "",
      roomTypes: ["Option 1", "Option 2", "Option 3"],
      location: "",
      additionalNeeds: [],
      needs: ["Option 1", "Option 2"],
      allItems: [],
      selectedSort: "",
      sortOptions: ["Option 1", "Option 2"],
      reservationStartDate: null,
      reservationEndDate: null,
    };
  },
  methods: {
    async fetchData() {
      const urls = [
        { url: "http://127.0.0.1:8000/api/rooms", type: "Room" },
        { url: "http://127.0.0.1:8000/api/equipment", type: "Equipment" },
        { url: "http://127.0.0.1:8000/api/vehicles", type: "Vehicle" },
      ];
      try {
        const responses = await Promise.all(
          urls.map((entry) => axios.get(entry.url))
        );
        this.allItems = responses.flatMap((response, index) =>
          response.data.map((item) => ({
            ...item,
            type: urls[index].type,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    updateDates(dates) {
      this.reservationStartDate = dates.start;
      this.reservationEndDate = dates.end;
    },
    makeReservation(itemId, itemType) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to make a reservation.");
        return;
      }

      const reservationType = itemType.toLowerCase(); // lowercase expectend in backend

      const reservationData = {
        reservable_id: itemId,
        reservation_type: reservationType, 
        start_date: this.reservationStartDate,
        end_date: this.reservationEndDate,
        status: "Reserved",
      };

      axios
        .post("http://127.0.0.1:8000/api/reservations", reservationData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("Reservation successful");
          this.fetchData();
        })
        .catch((error) => {
          console.error(
            "Error making reservation:",
            error.response ? error.response.data : "An error occurred"
          );
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
