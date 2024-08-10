<template>
  <v-container fill-height>
    <v-row
      justify="center"
      align="center"
      class="button-row"
      style="margin-top: 5vh"
    >
      <v-col
        cols="10"
        sm="5"
        md="3"
        class="py-3"
        v-for="(item, index) in menuItems"
        :key="index"
      >
        <v-btn
          :to="item.route"
          block
          large
          color="teal"
          class="white--text custom-button"
        >
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <v-icon class="mr-2" style="font-size: 48px">{{
              item.icon
            }}</v-icon>
            <span
              v-if="item.text === 'Automobilių rezervacija'"
              class="mt-1 text-on-new-lines"
            >
              Automobilių<br />rezervacija
            </span>
            <span v-else class="mt-1">{{ item.text }}</span>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5">
      <v-col cols="12">
        <v-card>
          <v-card-title> Mano aktyvios rezervacijos </v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="formattedTableData"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="() => showReservation(item)"
                >mdi-information-outline</v-icon
              >
              <v-icon small @click="() => cancelReservation(item)"
                >mdi-delete</v-icon
              >
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="300px">
      <v-card>
        <v-card-title class="text-h5">Confirm Cancellation</v-card-title>
        <v-card-text>
          Are you sure you want to cancel this reservation?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="blue darken-1" text @click="confirmCancellation"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="infoDialog" persistent max-width="600px">
      <v-card v-if="currentReservationInfo">
        <v-card-title class="text-h5">Reservation Details</v-card-title>
        <v-card-text>
          <div><strong>Name:</strong> {{ currentReservationInfo.name }}</div>
          <div><strong>Type:</strong> {{ currentReservationInfo.type }}</div>
          <div>
            <strong>Location:</strong> {{ currentReservationInfo.location }}
          </div>
          <div v-if="currentReservationInfo.additional_details">
            <strong>Additional Details:</strong>
            {{ currentReservationInfo.additional_details }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="infoDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "ReservationButtonsAndTable",
  data: () => ({
    menuItems: [
      {
        icon: "mdi-domain",
        text: "Patalpų rezervacija",
        route: "/patalpu-rezervacija",
      },
      {
        icon: "mdi-camera",
        text: "Įrangos rezervacija",
        route: "/irangos-rezervacija",
      },
      {
        icon: "mdi-car",
        text: "Automobilių rezervacija",
        route: "/automobiliu-rezervacija",
      },
      { icon: "mdi-magnify", text: "Detali paieška", route: "/detali-paieska" },
    ],
    tableHeaders: [
      { text: "Reservable Type", value: "reservable_type_name" },
      { text: "Start Date", value: "start_date" },
      { text: "End Date", value: "end_date" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    tableData: [],
    dialog: false,
    currentItem: null,
    infoDialog: false,
  }),
  computed: {
    formattedTableData() {
      return this.tableData.map((item) => ({
        ...item,
        reservable_type_name: item.reservable_type.split("\\").pop(),
      }));
    },
  },
  methods: {
    async fetchData() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/active-reservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.tableData = response.data;
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    },
    showReservation(item) {
      const reservableId = item.reservable_id;
      const reservableType = item.reservable_type_name.toLowerCase();
      let endpoint = "";

      switch (reservableType) {
        case "room":
          endpoint = `http://127.0.0.1:8000/api/rooms/${reservableId}`;
          break;
        case "equipment":
          endpoint = `http://127.0.0.1:8000/api/equipment/${reservableId}`;
          break;
        case "vehicle":
          endpoint = `http://127.0.0.1:8000/api/vehicles/${reservableId}`;
          break;
        default:
          console.error("Unsupported reservable type:", reservableType);
          return;
      }

      axios
        .get(endpoint)
        .then((response) => {
          console.log(response.data); 
          this.currentReservationInfo = response.data;
          this.infoDialog = true; 
        })
        .catch((error) => {
          console.error("Error fetching reservation information:", error);
        });
    },
    cancelReservation(item) {
      this.currentItem = item;
      this.dialog = true;
    },
    confirmCancellation() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to cancel a reservation.");
        this.dialog = false;
        return;
      }

      axios
        .patch(
          `http://127.0.0.1:8000/api/cancel-reservation/${this.currentItem.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          alert("Reservation cancelled successfully.");
          this.dialog = false;
          this.fetchData();
        })
        .catch((error) => {
          console.error(
            "Error cancelling reservation:",
            error.response ? error.response.data : "An error occurred"
          );
          alert("Failed to cancel reservation.");
          this.dialog = false;
        });
      this.currentItem = null;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.button-row > .v-col {
  display: flex;
  justify-content: center;
}

.v-btn {
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .v-btn {
    padding: 12px 5px;
  }
}

.custom-button {
  padding: 48px;
}
</style>
