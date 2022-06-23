<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile'" class="drawer-bg" @click="handleClickOutside" />
    <div v-if="theme === 'theme-dark'" class="theme-dark">
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <Navbar />
        </div>
        <app-main />
        <div>
          <div class="footer"></div>
        </div>
      </div>
    </div>
    <div v-if="theme === 'theme-light'" class="theme-light">
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <Navbar />
        </div>
        <app-main />
        <div>
          <div class="footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      theme: this.$store.state.settings.theme
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.footer {
  height: 50px;
  position: 'fixed';
  bottom: 0;
  background-color: #a6b2c6 !important;
}
.theme-dark{
  background: #909397 !important;
}
.theme-light{
  background: #d9dcdf !important;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  // width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
