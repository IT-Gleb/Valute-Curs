<template>
  <header-view></header-view>
  <div class="container">
    <div class="columns is-align-items-flex-start">
      <div class="column">
        <main-message></main-message>
        <suspense>
          <template #default>
            <component :is="ValuteTbl"></component>
            <!-- <valute-table></valute-table> -->
          </template>
          <template #fallback>
            <my-spinner></my-spinner>
          </template>
        </suspense>
      </div>
      <div class="column">
        <div class="block">
          <suspense>
            <template #default>
              <!-- <data-valute-range></data-valute-range> -->
              <component :is="dataValuteRange"></component>
            </template>
            <template #fallback>
              <my-spinner></my-spinner>
            </template>
          </suspense>
        </div>
        <div class="block">
          <suspense>
            <template #default>
              <component :is="chartValute"></component>
              <!-- <chart-valute></chart-valute> -->
            </template>
            <template #fallback>
              <my-spinner></my-spinner>
            </template>
          </suspense>
        </div>
        <div class="block">
          <suspense>
            <template #default>
              <component :is="BarValute"></component>
            </template>
            <template #fallback>
              <my-spinner></my-spinner>
            </template>
          </suspense>
          <!-- <chart-comp></chart-comp> -->
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
// import ValuteTable from "@/components/ValuteTable.vue";
//import ChartComp from "@/components/ChartComp.vue";
// import dataValuteRange from "@/components/dataValuteRange.vue";
// import chartValute from "@/components/chartValute.vue";
import MainMessage from "@/components/MainMessage.vue";
import MySpinner from "@/components/MySpinner.vue";
import { defineAsyncComponent, defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
  components: {
    HeaderView,
    MainFooter,
    // ValuteTable,
    // ChartComp,
    //ChartComp: defineAsyncComponent(() => import("@/components/ChartComp.vue")),
    // dataValuteRange,
    // chartValute,
    MainMessage,
    MySpinner,
  },
  setup() {
    const Errmsg = defineAsyncComponent({
      loader: () => import("@/components/ErrorMessage.vue"),
      loadingComponent: MySpinner,
      delay: 200,
      timeout: 5000,
      suspensible: true,
    });

    const ValuteTbl = defineAsyncComponent({
      loader: () => import("@/components/ValuteTable.vue"),
      loadingComponent: MySpinner,
      delay: 500,
      timeout: 5000,
      errorComponent: Errmsg,
      suspensible: true,
    });

    const BarValute = defineAsyncComponent({
      loader: () => import("@/components/ChartComp.vue"),
      delay: 700,
      loadingComponent: MySpinner,
      timeout: 7000,
      errorComponent: Errmsg,
      suspensible: true,
    });

    const chartValute = defineAsyncComponent({
      loader: () => import("@/components/chartValute.vue"),
      delay: 700,
      loadingComponent: MySpinner,
      timeout: 5000,
      errorComponent: Errmsg,
      suspensible: true,
    });

    const dataValuteRange = defineAsyncComponent({
      loader: () => import("@/components/dataValuteRange.vue"),
      delay: 500,
      loadingComponent: MySpinner,
      timeout: 5400,
      errorComponent: Errmsg,
      suspensible: true,
    });

    return {
      ValuteTbl,
      chartValute,
      BarValute,
      dataValuteRange,
    };
  },
});
</script>
