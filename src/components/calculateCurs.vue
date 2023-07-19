<template>
  <div class="columns is-flex is-flex-wrap-wrap mb-0 is-mobile">
    <div class="column is-full">
      <div class="title is-small is-size-4">Рассчитать</div>
    </div>
    <div class="column is-6 ml-0 mb-0">
      <span class="is-size-7 has-text-weight-semibold is-clipped">
        Российский рубль
      </span>
      <div class="control has-icons-left has-icons-right">
        <input
          class="input is-small"
          type="number"
          name="rubs"
          id="idRub"
          maxlength="12"
          size="5"
          min="0"
          :value="valuteRub"
          @input="($event) => calculateValute($event)"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-money-bill-wave"></i>
        </span>
      </div>
    </div>

    <div class="column is-6 ml-0 mb-0">
      <span class="is-size-7 has-text-weight-semibold is-clipped">
        {{ valuteName }}
      </span>
      <div class="control has-icons-left has-icons-right">
        <input
          class="input is-small"
          type="number"
          name="valute"
          id="idValute"
          maxlength="12"
          size="5"
          min="0"
          :value="valuteValue"
          @input="($event) => calculateRub($event)"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-money-bill"></i>
        </span>
      </div>
    </div>
    <div class="column is-12 has-text-centered">
      {{ TextMsg }}
      <span class="icon">
        <i :class="isChanged ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { isObject_empty } from "@/lib";

// const props = defineProps({
//   paramValue: String,
// });
//console.log(props);

const valuteValue = ref(0);
const valuteName = ref("Наименование");
const valuteRub = ref(0);
// const valuteObj = ref();
const store = useStore();
let currentValute = {};
const TextMsg = ref("");
const isChanged = ref(false);

watchEffect(() => {
  currentValute = store.getters["GET_SELECTED_VALUTE"];
  if (currentValute && !isObject_empty(currentValute)) {
    valuteName.value = currentValute.Name;
    valuteValue.value = currentValute.Nominal;
    valuteRub.value = parseFloat((currentValute.Value * 100) / 100).toFixed(2);
    isChanged.value = true;
    TextMsg.value = "Вы выбрали: " + valuteName.value;
  } else {
    isChanged.value = false;
    TextMsg.value = "Выберите валюту для рассчета...";
  }
});

const calculateValute = (e) => {
  if (isObject_empty(currentValute)) return 0;
  valuteRub.value = e.target.value;
  // console.log(valuteValue.value);
  // console.log(t_val);
  // console.log(currentValute);
  let tmp = (valuteRub.value / currentValute.Value) * currentValute.Nominal;
  tmp = ((tmp * 100) / 100).toFixed(2);
  //console.log(tmp);
  valuteValue.value = tmp;
  return tmp;
};

const calculateRub = (e) => {
  if (isObject_empty(currentValute)) return 0;
  valuteValue.value = e.target.value;
  let tmp = (valuteValue.value * currentValute.Value) / currentValute.Nominal;
  tmp = ((tmp * 100) / 100).toFixed(2);
  valuteRub.value = tmp;
  //console.log(valuteRub.value);
  // return valuteRub.value;
  return tmp;
};

onBeforeMount(() => {
  valuteName.value = "Наименование";
  valuteRub.value = 0;
  valuteValue.value = 0;
  //  TextMsg.value = "Выберите валюту для рассчета...";
});

onMounted(() => {});
</script>

<style scoped lang="scss">
span {
  white-space: nowrap;
  // max-width: 100px;
  // text-overflow: ellipsis;
}
.columns {
  border-bottom: solid 1px rgba(127, 127, 127, 0.15);
}
</style>
