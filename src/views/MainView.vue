<template>
  <header-view></header-view>
  <div class="container">
    <div class="columns is-align-items-flex-start">
      <div class="column">
        <valute-table></valute-table>
      </div>
      <div class="column">
        <div class="block">
          <data-valute-range></data-valute-range>
        </div>
        <div class="block">
          <chart-valute></chart-valute>
        </div>
        <div class="block">
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
