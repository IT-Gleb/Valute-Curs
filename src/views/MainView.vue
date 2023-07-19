<template>
  <header-view></header-view>
  <div class="container">
    <div class="columns is-vcentered is-desktop">
      <div class="column">
        <valute-table></valute-table>
      </div>
      <div class="column is-align-self-center">
        <div class="block mr-4">
          <data-valute-range></data-valute-range>
        </div>
        <div class="block mr-4">
          <chart-valute></chart-valute>
        </div>
        <div class="block mr-4">
          <chart-comp></chart-comp>
        </div>
      </div>
    </div>
  </div>
  <!-- <xml-req-data></xml-req-data> -->
  <main-footer></main-footer>
</template>

<script>
// @ is an alias to /src
import HeaderView from "@/views/HeaderView.vue";
import MainFooter from "@/components/MainFooter.vue";
import ValuteTable from "@/components/ValuteTable.vue";
import ChartComp from "@/components/ChartComp.vue";
import dataValuteRange from "@/components/dataValuteRange.vue";
import chartValute from "@/components/chartValute.vue";

export default {
  name: "HomeView",
  components: {
    HeaderView,
    MainFooter,
    ValuteTable,
    ChartComp,
    dataValuteRange,
    chartValute,
  },
};
</script>
