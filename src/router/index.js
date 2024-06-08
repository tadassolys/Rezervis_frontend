import { createRouter, createWebHistory } from "vue-router";
import PatalposView from "../views/PatalposView.vue";
import MeniuView from "../views/MeniuView.vue";
import IrangaView from "../views/IrangaView.vue";
import TestView from "../views/TestView.vue";
import AutomobiliaiView from "../views/AutomobiliaiView.vue";
import DetaliPaieskaView from "../views/DetaliPaieskaView.vue";
import RezervacijuIstorija from '../views/RezervacijuIstorija.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "pagrindinis",
      component: MeniuView,
    },

    {
      path: "/patalpu-rezervacija",
      name: "patalpos",
      component: PatalposView,
    },

    {
      path: "/irangos-rezervacija",
      name: "iranga",
      component: IrangaView,
    },

    {
      path: "/test",
      name: "test",
      component: TestView,
    },

    {
      path: "/automobiliu-rezervacija",
      name: "automobiliai",
      component: AutomobiliaiView,
    },

    {
      path: "/detali-paieska",
      name: "detali",
      component: DetaliPaieskaView,
    },

    {
      path: "/rezervaciju-istorija",
      name: "istorija",
      component: RezervacijuIstorija,
    },

  ],
});

export default router;
