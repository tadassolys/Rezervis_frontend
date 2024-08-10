<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <!-- Left Column: Filters -->
          <v-col cols="12" md="3">
            <!-- Room Type Filter -->
            <v-card class="mb-2" outlined>
              <v-select
                label="Room Type*"
                v-model="selectedRoomType"
                :items="roomTypes"
              ></v-select>
            </v-card>

            <!-- Location Filter -->
            <v-card class="mb-2" outlined>
              <v-text-field label="Location*" v-model="location"></v-text-field>
            </v-card>

            <!-- Date and Time Picker Placeholder -->

            <DateTimePicker @update:dates="updateDates" />

            <!-- Additional Requirements Filter -->
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

          <!-- Right Column: Room Listings -->
          <v-col cols="12" md="9">
            <v-card class="pa-4" outlined>
              <v-row>
                <v-col cols="12">
                  <h2>Rooms</h2>
                </v-col>
              </v-row>

              <!-- Rooms List -->
              <v-row>
                <v-col v-for="room in rooms" :key="room.id" cols="12">
                  <v-card class="pa-3 mb-2" outlined>
                    <v-row align="center" justify="space-between" no-gutters>
                      <v-col cols="8">
                        <div class="d-flex flex-column">
                          <!-- Displaying Room Details -->
                          <div class="subtitle-1">Name: {{ room.name }}</div>
                          <div class="subtitle-1">Type: {{ room.type }}</div>
                          <div class="subtitle-1">
                            Location: {{ room.location }}
                          </div>
                           <div class="subtitle-1">
                            Details: {{ room.additional_details }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-end">
                        <v-btn
                          text
                          color="primary"
                          @click="makeReservation(room.id, reservableId)"
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
      roomTypes: ["darbo", "Meeting", "Break Room"],
      location: "",
      additionalNeeds: [],
      needs: ["Projector", "Whiteboard"],
      rooms: [],
      reservationStartDate: null,
      reservationEndDate: null,
      authenticatedUserId: null,
    };
  },
  created() {
    this.fetchRooms();
  },
  watch: {
    location() {
      this.filterRooms();
    },
    selectedRoomType() {
      this.filterRooms();
    },

    reservationStartDate() {
      this.fetchRooms();
    },
    reservationEndDate() {
      this.fetchRooms();
    },
  },
  methods: {
    fetchRooms() {
      const params = {
        start_date: this.reservationStartDate,
        end_date: this.reservationEndDate,
      };

      axios
        .get("http://127.0.0.1:8000/api/rooms", { params })
        .then((response) => {
          this.allRooms = response.data;
          this.rooms = response.data;
        })
        .catch((error) => {
          console.error("There was an error fetching the rooms:", error);
        });
    },
    filterRooms() {
      this.rooms = this.allRooms.filter((room) => {
        const matchesLocation = this.location
          ? room.location.toLowerCase().includes(this.location.toLowerCase())
          : true;
        const matchesType = this.selectedRoomType
          ? room.type === this.selectedRoomType
          : true;
        return matchesLocation && matchesType;
      });
    },

    updateDates(dates) {
      this.reservationStartDate = dates.start;
      this.reservationEndDate = dates.end;
      this.fetchRooms();
    },
    makeReservation(reservableId, reservableType) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to make a reservation.");
        return;
      }

      const reservationData = {
        reservable_id: reservableId,
        reservation_type: "room",
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
          this.fetchRooms();
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
