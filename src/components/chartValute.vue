<template>
  <my-spinner v-if="isLoading"></my-spinner>

  <div class="box" v-show="isShow && !isLoading">
    <div class="subtitle is-size-5 has-text-centered">
      График колебания валюты
    </div>
    <div class="chartBox">
      <canvas ref="ctxChart"></canvas>
    </div>
    <div class="notification is-light mt-1 mb-0 has-text-centered is-size-7">
      <div class="columns">
        <div class="column">
          Минимальное значение:
          <div class="tile is-parent">
            <div class="tile is-child">{{ MinMaxData.Min.Date }}</div>
            <div class="tile is-child is-pulled-right is-size-6">
              {{ MinMaxData.Min.Value }}
            </div>
          </div>
        </div>
        <div class="column">
          Максимальное значение:
          <div class="tile is-parent">
            <div class="tile is-child">{{ MinMaxData.Max.Date }}</div>
            <div class="tile is-child is-pulled-right is-size-6">
              {{ MinMaxData.Max.Value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$ctxWidth: 900 * 1px;
.chartBox {
  position: relative;
  max-width: $ctxWidth;
  min-height: 35vh;
  margin: 0 auto;

  padding: 8px;
  //  border: solid 1px darkgrey;
  //  border-radius: 20px 20px;
}
</style>

<script>
import { Chart } from "chart.js";
import { watchEffect, ref, onMounted, onUnmounted, defineComponent } from "vue";
import { useStore } from "vuex";
import MySpinner from "@/components/MySpinner.vue";

export default defineComponent({
  components: {
    MySpinner,
  },

  setup() {
    const store = useStore();
    const isShow = ref(false);
    let ctxChart = ref();
    let dataVal = [];
    let labelsData = [];
    let config = {};
    let ctxValute = null;
    let NameValute = "";
    let isLoading = ref(true);
    let MinMaxData = ref({
      Min: { Date: 0, Value: 0 },
      Max: { Date: 0, Value: 0 },
    });
    // const MinMaxText = ref("");

    function minFromArray(paramArray) {
      let res = { Min: { Date: 0, Value: 0 }, Max: { Date: 0, Value: 0 } };
      let temp = [];

      if (Array.isArray(paramArray) && paramArray.length > 0) {
        temp = paramArray.map((item) => {
          return item.Value;
        });
        if (temp.length > 0) {
          let m = Math.min(...temp);
          let top = Math.max(...temp);
          let indMin = temp.indexOf(String(m.toFixed(2)));

          let indMax = temp.indexOf(String(top.toFixed(2)));

          res.Min.Value = m;
          //          console.log(m, top, indMin, indMax);
          res.Min.Date = paramArray[indMin].Date;
          res.Max.Value = top;
          res.Max.Date = paramArray[indMax].Date;
        }
      }
      return res;
    }

    function initChart() {
      //---------Config---------------------
      config = {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: "rgba(25, 125, 0, 0.2)",
              borderColor: "rgba(25, 155, 0, 1)",
              borderWidth: 0.6,
              fill: true,
              tension: 0.45,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          //          aspectRatio: 2,
          elements: {
            point: {
              pointStyle: "rectRot",
            },
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            subtitle: {
              display: true,
              position: "top",
              text: "", //NameValute,
              //   text: `ВАЛЮТЫ:  ${store.getters.GET_DATE_VALUTES}`,
              font: { size: 18 },
            },
          },
        },
      };
      //------------End of Config-----------------
      //------------Render------------------------
      if (ctxValute) {
        ctxValute.destroy();
        ctxValute = null;
      }
      ctxValute = new Chart(ctxChart.value, config);
      //------------------------------------------
    }

    watchEffect(() => {
      //Проверить на загрузку
      isLoading.value = store.getters["xmlData/GET_IS_LOAD_DATA"];

      let lenData = store.getters["xmlData/GET_DATA_LENGTH"] > 0;
      let selData = store.getters["GET_SELECTED_VALUTE"];
      NameValute = selData.Name;
      let paramData = store.getters["xmlData/GET_PARAM"];
      let nameEqual =
        String(selData.Name).toLowerCase() ===
        String(paramData.valuteName).toLowerCase();
      //console.log(selData, paramData, lenData);
      isShow.value = lenData && nameEqual;

      //Получить данные
      if (lenData && nameEqual) {
        let tmpData = store.getters["xmlData/GET_DATA"];
        dataVal = tmpData.map((item) => {
          return item.Value;
        });
        labelsData = tmpData.map((item) => {
          return item.Date;
        });

        //Get min max value;
        MinMaxData.value = minFromArray(tmpData);
        //console.log(MinMaxData.value);

        //        console.log(dataVal);
        //init Chart
        if (ctxValute) {
          ctxValute.data.labels = labelsData;
          ctxValute.data.datasets[0].data = dataVal;
          ctxValute.options.plugins.subtitle.text = NameValute;
          // ctxValute.options.scales.x.min = 0;
          // ctxValute.options.scales.x.max = dataVal.length - 1;
          ctxValute.update("none");
        }
      }
    });

    onMounted(() => {
      //initChart
      initChart();
    });

    onUnmounted(() => {
      if (ctxValute) {
        ctxValute.destroy();
        ctxValute = null;
      }
    });

    return {
      isShow,
      ctxChart,
      MinMaxData,
      isLoading,
    };
  },
});
</script>
