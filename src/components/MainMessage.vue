<template>
  <article class="message mt-2 is-success mb-0">
    <div class="message-header">
      <p>
        <span class="icon mr-2">
          <i class="fas fa-info-circle"></i>
        </span>

        Проект - Курс Валют
      </p>
      <span class="is-size-7 is-pulled-right"
        >Ознакомится
        <span class="icon">
          <i class="fas fa-arrow-right"></i>
        </span>
      </span>

      <button
        class="button is-middle is-rounded is-success"
        :title="isShowBody ? 'Свернуть' : 'Развернуть'"
        @click="handleButton"
      >
        <span class="icon">
          <i
            :class="
              isShowBody ? 'fas fa-arrow-circle-up' : 'fas fa-arrow-circle-down'
            "
          ></i>
        </span>
      </button>
    </div>
    <div v-if="isShowBody" class="message-body">
      <p>Проект использует</p>
      <span class="tag is-warning">css framework BULMA</span>.
      <span class="tag is-warning">JavaScript</span> framework
      <span class="tag is-warning">Vue 3</span>
      <p>
        Используется
        <a href="https://www.cbr-xml-daily.ru/" target="_blank"
          >Курсы ЦБ РФ в XML и JSON, API</a
        >
        - для получения информации об изменении курса основных валют.
      </p>
      <p>
        Используется API от Центрального Банка России
        <a href="https://www.cbr.ru/development/dws" target="_blank"
          >(ЦБ России)</a
        >
        для получения информации и визуализация графиков колебания курса
        отдельной валюты.
      </p>
      <p>
        Столкнулся с технологией CORS. Победить
        <span class="title is-size-6 has-text-info">УДАЛОСЬ</span>. На локальном
        сервере проблем с CORS запросами не наблюдается.
        <span class="icon"> <i class="fas fa-thumbs-up"></i></span>
      </p>

      <p>
        Для работы без сервера Вышел из положения благодаря сервису -
        <a href="https://cors-anywhere.herokuapp.com" target="_blank"
          >https://cors-anywhere.herokuapp.com</a
        >
        Перед использованием данного сервиса рекомендуется пройти по ссылке.
      </p>
      <p class="has-text-info">
        <span class="title is-size-5 has-text-link">Внимание!!!</span>
        Все расчеты производятся по курсу валюты, информация о которой
        предоставлена Центральным банком России. При покупке или продаже будет
        использоваться курс вашего коммерческого банка. Он может отличаться от
        курса ЦБ РФ.
      </p>
    </div>
  </article>
</template>

<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "MainMessage",
  setup: () => {
    const isShowBody = ref(false);

    const handleButton = () => {
      isShowBody.value = !isShowBody.value;
    };

    return {
      isShowBody,
      handleButton,
    };
  },
});
</script>

<style scoped lang="scss">
p {
  text-indent: 20px;
}
</style>
