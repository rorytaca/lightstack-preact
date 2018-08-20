// global client side scripts here...
(($) => {
  const appController = {
    init() {
      this.state = { /* SET STATE HERE */ }

      this.elems = { /* SET ELEMS HERE */ }

      this.bindEvents();
    },

    bindEvents() { /* SET EVENT BINDINGS HERE */}
  }

  appController.init();

})(jQuery);