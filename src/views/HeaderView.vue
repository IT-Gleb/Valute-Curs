<template>
  <header class="is-fullwidth">
    <section class="hero is-small is-info">
      <div class="hero-body">
        <!-- <p class="title">Header</p>
      <p class="subtitle">Еще бвао лко цуалдлуо лдулоак дул</p> -->
        <div class="tile is-pulled-right">
          <button
            class="button is-small is-success is-rounded"
            @click="handleUpdate"
          >
            <span class="icon mr-1">
              <i class="fas fa-spinner"></i>
            </span>
            Обновить
          </button>
        </div>
      </div>
    </section>
  </header>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainHeader",
  setup: () => {
    const route = useRouter();
    const mainPath = route.getRoutes();

    function handleUpdate() {
      // forceUpdate();
      //console.log("Update...", mainPath);
      // route.push({ path: "/" });
      // route.go(0);
      route.go(mainPath[0].path);
    }
    return {
      handleUpdate,
    };
  },
});
</script>
