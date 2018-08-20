(($, controller) => {
  const routeController = {
    init() {
      this.elems ={
        /* SET ELEMS */
      }

      this.state = {
        routeId: `#${controller}-route`
      }
      
      this.bindEvents();
    },

    bindEvents() { }
  }

  routeController.init();

})(jQuery, 'index');
