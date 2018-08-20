/*
 * Utils.js
 * global utility functions script
 * 
 * Exposes a global `Utils` to all preceeding scripts. House common functions to be used across page specific js here.
 */
window.Utils = (($) => {
  function debounce(fn, delay) {
    let timer = null;
    return function () {
      let context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    let last,
        deferTimer;
    return function () {
      let context = scope || this;

      let now = (new Date()).getTime(),
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  function getWindowWidthEms() {
    return $(window).width() / 16;
  }

  function getUrlQueries() {
    let queries = window.location.search;

    if (!!queries && !!queries.length) {
      queries = queries
        .slice(1, queries.length)
        .split("&")
        .reduce(function(queries, query) {
          let querySplit = query.split("="),
              key = querySplit[0],
              value = querySplit[1];

          queries[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return queries;
        }, {});
    } else {
      queries = {};
    }

    return queries;
  }

  function generateUrlQueries(queriesObj) {
    if (!queriesObj || typeof queriesObj !== "object" || !Object.keys(queriesObj).length) {
      return "";
    }

    let string = "?",
        queriesList = Object.keys(queriesObj).map(function(key) {
          return key + "=" + queriesObj[key];
        });

    return (string + queriesList.join("&"));
  }

  // SOURCE: https://github.com/airbnb/is-touch-device/blob/master/src/index.js
  function isTouchDevice() {
    return (
      !!(typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          (window.DocumentTouch &&
            typeof document !== 'undefined' &&
            document instanceof window.DocumentTouch))) ||
      !!(typeof navigator !== 'undefined' &&
        (navigator.maxTouchPoints || navigator.msMaxTouchPoints))
    );
  }

  function turboBind(event, selector, func) {
    // if a click event, and a touch device, and not windows then use touchstart
    if (event === 'click' && isTouchDevice() && navigator.appVersion.indexOf("Win") === -1) {
      event = 'touchend';
    }

    $(document).on(event, selector, func);
  }

  function render(component, state) {
    $(`[data-component="${component}"]`).html(Handlebars.templates[component](state));
  }

  function moneyFormat(num) {
    return `$${parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
  }

  // @TODO:: Move into store locator
  // function distanceBetween(lat1, lon1, lat2, lon2, unit) {
  //   const radlat1 = Math.PI * lat1/180,
  //         radlat2 = Math.PI * lat2/180,
  //         theta = lon1-lon2,
  //         radtheta = Math.PI * theta/180;

  //   let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    
  //   dist = Math.acos(dist)
  //   dist = dist * 180/Math.PI
  //   dist = dist * 60 * 1.1515

  //   if (unit=="K") { dist = dist * 1.609344; }
  //   if (unit=="N") { dist = dist * 0.8684; }
  //   return dist;
  // }

  function setCookie(cname, cvalue, exdays) {
    let d = new Date();

    if (typeof cname !== 'undefined') {
      document.cookie = cname + "=" + cvalue + "; expires=" + d.setTime(d.getTime() + (exdays*24*60*60*1000));
    }
  }

  function getCookie(cname) {
    if (typeof cname !== 'undefined') {
      let name = cname + "=",
          ca = document.cookie.split(';');

      for (let i=0; i<ca.length; i++) {
          let c = ca[i];

          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }

      return "";
    }
  }

  function checkCookie(cname) {
    if (typeof cname !== 'undefined') {
      let check = getCookie(cname);

      if (check != "") {
        return true;
      } else {
        return false;
      }
    } 
  }

  function deleteCookie(cname, path, domain) {
    if (checkCookie(cname)) {
      document.cookie = cname + "=" +
        ((path) ? ";path="+path:"")+
        ((domain) ? ";domain="+domain:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

  return {
    debounce,
    throttle,
    getWindowWidthEms,
    getUrlQueries,
    generateUrlQueries,
    isTouchDevice,
    turboBind,
    render,
    moneyFormat,
    setCookie,
    getCookie,
    checkCookie,
    deleteCookie
  }
})(jQuery);