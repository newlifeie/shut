$ = jQuery;

// for test add to cart
if ( window.location.href.indexOf("https://squaremuse.com/cart?product") != -1 ) {
  var product_id = sm_url_have_product_id();
  if( '' != product_id ) {
    $('body')
      .css('opacity',0)
      .append('<div class="sqs-add-to-cart-button sm-hide-btn" data-item-id="'+product_id+'" data-product-type="2"><div class="sqs-add-to-cart-button-inner">Add</div></div>');
  }
}

function getQueryParams () {
  function identity (e) { return e; }
  function toKeyValue (params, param) {
    var keyValue = param.split('=');
    var key = keyValue[0], value = keyValue[1];

    params[key] = params[key]?[value].concat(params[key]):value;
    return params;
  }
  return decodeURIComponent(window.location.search).
  replace(/^\?/, '').split('&').
  filter(identity).
  reduce(toKeyValue, {});
}

function sm_url_have_product_id() {
  var get_link = window.location.href;
  var get_product = '';
  if( get_link.indexOf("https://squaremuse.com/cart?product") != -1 ){
    var get_params = getQueryParams();
    get_product = get_params.product;
  }

  return get_product
}

function sm_add_to_cart() {
  var product_id = sm_url_have_product_id();
  if( '' != product_id ) {
    $('.sqs-add-to-cart-button[data-item-id="'+product_id+'"]').trigger('click');

    setTimeout(function(){
      window.location.href = 'https://squaremuse.com/cart?success_promo';
    }, 1500);
  }
}

$(window).load(function () {
  // mobile menu top info bar
  var topBar = $('.sqs-announcement-bar-dropzone');
  if( topBar.length ) {
    $('.sqmuse-mobile-overlay .Mobile-bar--top').css('margin-top', topBar.outerHeight()+'px');
  }

  // set margin 0 after close top info bar
  $('.sqs-announcement-bar-close').on('click', function () {
    $('.sqmuse-mobile-overlay .Mobile-bar--top').css('margin-top', '0');
  });
});

$(document).ready(function() {
  // header-overlay
  if ( $('section:first-child').hasClass('Index-page--has-image') ) {
    $('header.Header--bottom').addClass('Header--overlay');
  }

  // blog item to docs item after converted collection
  if ( $('.collection-type-blog.view-item').length ) {
    $('.Main--documentation-item').addClass('Main--blog-item');
  }

  sm_add_to_cart();
  /* track fb add to cart */
  //console.log('sm_product_json==',sm_product_json);
  $('.sqs-add-to-cart-button').on('click', function () {
    //console.log('click add to cart');
    if (typeof sm_product_json !== 'undefined') {
      var itemID       = sm_product_json.item.id;
      var collectionID = sm_product_json.item.collectionId;
      var itemTitle    = sm_product_json.item.title;
      var itemPrice    = sm_product_json.item.priceMoney.value;
    }
    else {
      /* is not single product page, but is used as summary product */
      var itemID       = $(this).attr('data-item-id');
      var collectionID = $(this).attr('data-collection-id');
      var itemTitle    = $(this).parents('.sqs-block-product').parent().find('.summary-item .summary-title-link').html();
      var itemPrice    = $(this).parents('.sqs-block-product').parent().find('.summary-item .sqs-money-native').html();
    }

    fbq('track', 'AddToCart', {
      content_name: itemTitle,
      content_category: collectionID,
      content_ids: [itemID],
      content_type: 'product',
      value: itemPrice,
      currency: 'USD'
    });
  });

  /* tracking initiate checkout */
  //if ( 'https://squaremuse.com/cart?vlad-test' == window.location.href ) {
    $('.checkout-button').on('click', function () {
      var checkoutProducts = [];
      var total = 0;
      var cartProducts = $('#sqs-cart-root [type="application/json"]').html();
      var parsedProducts = JSON.parse(cartProducts);
      $.each( parsedProducts.cart.items, function( key, value ) {
        checkoutProducts.push({id:value.productId, quantity:value.quantity, title:value.productName, price: value.unitPrice.decimalValue});
        total += parseFloat(value.unitPrice.decimalValue);
      });
      //console.log('checkoutProducts==',checkoutProducts);

      fbq('track', 'InitiateCheckout',
        // begin parameter object data
        {
          value: total,
          currency: 'USD',
          contents: parsedProducts,
          content_type: 'product'
        }
      );
    });
  //}

  // for get products ids and title in console to insert in products.json
  /*if ( 'https://squaremuse.com/shop-pricing-kits?sm_get_json' == window.location.href ) {
    var p_json = [];
    $.each( sm_product_json.items, function( key, value ) {
      p_json[value.id] = value.title;
    });
    console.log('p_json==',p_json);
  }*/

    // mobile menu logo overlay
    if ( $('.Header--overlay').length > 0 ) {
      $('body').addClass('sqmuse-mobile-overlay');
    }

    // $(window).load(function () {
    //     $('#main-preloader').fadeOut(1000).delay(2000);
    // });

    // this make the live demo links on product details not clickable I comment this temporary
    // prevent default with links that are with "#"
    /*$('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });*/

    jQuery(window).load(function() {
        setTimeout(function(){
            $('.flo-showcases .kits-grid').isotope('reloadItems');
            $('.flo-showcases .kits-grid').isotope('layout');
        }, 1000);
    });

    /* start niceSelect */
    $('select').niceSelect();

    $('section[id^="kits-slideshow"] .summary-item-list, section[id^="dyi-kits"] .summary-item-list').slick({
        slide: '.summary-item',
        arrows: true,
        infinite: false,
        centerMode: false,
        slidesToShow: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
                }
            }
        ]
    });

    $('[id^="kits-promo"] .summary-item-list').slick({
      slide: '.summary-item',
      arrows: true,
      infinite: false,
      centerMode: false,
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 4000,
      responsive: [
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: false,
              }
          }
      ]
    });

    $('[id^="elelements-vertical-slider"] .summary-item-list').slick({
      slide: '.summary-item',
      arrows: true,
      infinite: false,
      vertical: true,
      centerMode: true,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 5000,
    });

    $(' section[id^="latest-custom-elements"] .summary-item-list').slick({
        slide: '.summary-item',
        arrows: false,
        infinite: false,
        centerMode: false,
        slidesToShow: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('section[id^="recent-launches"] .sqs-col-9 .summary-item-list').slick({
        slide: '.summary-item',
        arrows: false,
        infinite: false,
        centerMode: false,
        slidesToShow: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('[id^="recent-launches-gray"] .summary-item-list, section[id^="recent-launches-white"] .summary-item-list').slick({
        slide: '.summary-item',
        arrows: true,
        infinite: false,
        centerMode: false,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.testimonials-launches-slider').slick({
        slide: '.item',
        arrows: false,
        infinite: false,
        centerMode: false,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('[id^="cols3-recent-launches"] .summary-item-list').slick({
        slide: '.summary-item',
        arrows: false,
        infinite: false,
        centerMode: false,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.testimonials-type-3 .testimonials-lists').slick({
      slide: '.item',
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      autoplay: false,
      autoplaySpeed: 4000,
    });

    $('section[id^="random-facts"] .summary-item-list').on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
        var i = (currentSlide ? currentSlide : 0) + 1;
        if (i <10) {
            jQuery(".fact-count").html('0' + i + '.');
        }
        else {
            jQuery(".fact-count").html(i + '.');
        }

    });

    $('section[id^="random-facts"] .summary-item-list').slick({
        slide: '.summary-item',
        arrows: false,
        infinite: true,
        centerMode: false,
        autoplay: false,
        adaptiveHeight: true,
        slidesToShow: 1,
        fade: true,
        cssEase: 'linear'
    });

    $(".random").click(function() {  //use a class, since your ID gets mangled
        $('section[id^="random-facts"] .summary-item-list').slick('slickNext');
    });

    $('.testimonials-type2-slider').slick({
        slide: '.item',
        arrows: false,
        infinite: true,
        centerMode: false,
        slidesToShow: 1,
        autoplay: false,
        dots: true,
        fade: true,
        cssEase: 'linear'
    });

    $(".elements-nav .element:first-child").addClass('active');
    $(".elements-image").addClass('active');
    var elimg = jQuery('.element.active').data('img');
    jQuery('.elements-image').html('<img src="' + elimg + '" />');
    $(".elements-nav .element").on("mouseover", (function(){
        $(".element").removeClass('active');
        $(".elements-image").removeClass('active');
        $(this).addClass('active');
        var elimg = jQuery(this).data('img');
        jQuery('.elements-image').html('<img src="' + elimg + '" />');
        $(".elements-image").addClass('active');
    }));

    $(".custom-box").on("mouseenter", function(){
      $(this).parents('section').find('.custom-box.active').removeClass('active');
      $(this).addClass('active');
    }).on("mouseleave", function(){
      $(this).removeClass('active');
    });

    /* make first item active */
  $('section[id^="home-latest-posts"] .sqs-block-code li:first-child a').addClass('active');
    $('section[id^="home-latest-posts"] .sqs-block-code a').on("mouseenter", function(){
      $(this).parents('section').find('a.active').removeClass('active');
      $(this).addClass('active');
    }).on("mouseleave", function(){
      $(this).removeClass('active');
    });

    // add active class for first custom box in service solutions
    $('section[id^="services-solutions"]').find('.sqs-col-4:first-child').find('.custom-box').addClass('active');

    $(".notice-open").on("mouseenter", function(){
        $(".notice").toggleClass('active');
    })/*.on("mouseleave", function(){
      //console.log('mouse-leave-notice-icon');
      $(".notice").toggleClass('active');
    });*/

    /*$('.notice').on("mouseleave", function(){
      //console.log('mouse-leave-notice-body');
      $(".notice").toggleClass('active');
    });*/

    $("#latest-custom-elements .summary-item").each( function() {
        var parent= $(this);
        parent.find(".summary-title").detach().appendTo(parent);
    });

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        //>=, not <=
        if (scroll >= 900) {
            //clearHeader, not clearheader - caps H
            $(".Header").addClass("sticky");
        }
        else {
            $(".Header").removeClass("sticky");
        }

        if (scroll >= 600) {
            $(".Mobile-bar--top").addClass("sticky");
        }
        else {
            $(".Mobile-bar--top").removeClass("sticky");
        }
    }); //missing );

    $(".sqs-block-video").click(function() {  //use a class, since your ID gets mangled
        $(".video-caption-wrapper").addClass("active");      //add the class to the clicked element
    });

    Y.on('domready',function(){
        function removeCents(){
            Y.all(".sqs-money-native").each(function(){this.setHTML(this.getHTML().split(".")[0])}).setStyle("visibility","visible");
        };
        removeCents();
        /*Add some timeouts for slow loading checkout page */
        setTimeout(removeCents,200);
        setTimeout(removeCents,1000);
        setTimeout(removeCents,2000);
    });

    if ($('.tabs-nav').length) {
        $('.tabs-nav li:first-child').addClass('active');
    }
    if ($('.tabs-content').length) {
        $('.tabs-content li:first-child').addClass('active');
    }


    $('.tabs-nav li').on("click", (function(){
        $('.tabs-nav li').removeClass("active");
        $(this).addClass('active');
        var dataid = $(this).data('id');
        $('.tabs-content li').removeClass("active");
        $('#' + dataid).addClass('active');
    }))

  // V filter isotope Kits Elements
  var difficultyFilter = jQuery('.flo-difficulty-filter');
  var versionFilter = jQuery('.flo-version-filter');

  // difficulty filter - now is category filter
  difficultyFilter.on('change', function (e) {
    var search = '.'+versionFilter.val()+'.'+jQuery(this).val();
    jQuery('.flo-kits-elements-list .item').removeClass('flo-item-show').addClass('flo-item-hide');
    jQuery('.flo-kits-elements-list').find(search).addClass('flo-item-show');
  });

    // version filter
    versionFilter.on('change', function (e) {
      if (difficultyFilter.length) {
        var search = '.'+difficultyFilter.val()+'.'+jQuery(this).val();
      }
      else {
        var search = '.'+jQuery(this).val();
      }

      jQuery('.flo-kits-elements-list .item').removeClass('flo-item-show').addClass('flo-item-hide');
      jQuery('.flo-kits-elements-list').find(search).addClass('flo-item-show');
    });

  // V remove cents on price
  Y.on('domready',function() {
    removeCents();
  });
  function removeCents() {
    Y.all(".flo-native-price").each(function(){this.setHTML(this.getHTML().split(".")[0])}).setStyle("visibility","visible");
  };

  // V - accordion in product-details
  var accTab = jQuery('.dificulty-info');
  if ( accTab.length ) {
    var sqs_ver = $('.sm-sqs-version-h'); // for 7.1
    if( sqs_ver.length ) {
      $('body').addClass('sm-squarespace-7-1');
      $('.sm-sqs-version').html( sqs_ver.html() );
      $('.level-personal').html( $('.level-personal-h').html() );
      $('.level-business').html( $('.level-business-h').html() );
    }
    //accTab.find('.tab-item p').slideUp();
    // find first tab
    accTab.find('.tab-item:first-child p').slideDown();
    accTab.find('.tab-item:first-child').addClass('open');

    accTab.find('.tab-item h3, .tab-item .tab-icon').on('click', function () {
      if( $(this).parent('.tab-item').hasClass('open') ) {
        // remove the open class
        accTab.find('.tab-item').removeClass('open');
        // close the current tab
        $(this).parent('.tab-item').find('p').slideUp();
        return;
      }

      // make all tabs closed
      accTab.find('p').slideUp();
      // remove the open class
      accTab.find('.tab-item').removeClass('open');
      // make only current tab active
      $(this).parent('.tab-item').find('p').slideDown();
      $(this).parent('.tab-item').addClass('open');
    });
  }

  // V sticky bar single elements
  window.onscroll = function () {
    stickyBar();
  };

  function stickyBar() {
    if (document.body.scrollTop > 650 || document.documentElement.scrollTop > 650) {
      jQuery('.kits-sticky-bar').addClass("sticky-active");
    }
    else {
      jQuery('.kits-sticky-bar').removeClass("sticky-active");
    }
  }

  // V details elements URL live demo
  if( jQuery('#productDetails').length ) {
    $.getJSON("https://squaremuse.com/assets/elements.json?v=1.0.33", function () {
      // Success
    }).done(function (rsp) {
      // Success
      //console.log('done');

      var data_url_id = jQuery('a[data-url-id]').attr('data-url-id');
      data_url_id = data_url_id.replace(/-/g, "_");
      var live_demo = "#";
      if ( rsp[data_url_id] !== undefined ) {
        live_demo = rsp[data_url_id].url;
      }
      // set the href to live demo button
      jQuery('a[data-url-id]').attr('href', live_demo);
    }).fail(function () {
      // Error
      console.log('fail');
    }).always(function () {
      // Complete
    });
  }

  // docs kits filter
  $('.docs-section .button-group button:first-child').addClass('is-checked');
  if (jQuery('.button-group button').hasClass('is-checked')) {
    var flval = $('.button-group button').data('filter');
    $('.doc-item').hide();
    $('.doc-item'+flval).show();
  }

  // change is-checked class on buttons
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
      var flval = $(this).data('filter');
      $('.doc-item').hide();
      $('.doc-item'+flval).show();
    });
  });

  // product details slider
  $('.kit-info-left').slick({
    slide: 'img',
    arrows: false,
    infinite: true,
    centerMode: false,
    slidesToShow: 1,
    autoplay: true,
    dots: false,
    fade: true,
    cssEase: 'linear'
  });

  // mobile menu
  var screenRes = $(window).width();
  $(window).resize(function () {
    screenRes = $(window).width();
  });

  $('.sqmuse-menu-text').on('click', function () {
    var $body = $('html');
    if( $body.hasClass('sqmuse-mobile-menu-open') ) {
      $body.removeClass('sqmuse-mobile-menu-open');
      $body.addClass('sqmuse-mobile-menu-closed');
      return;
    }

    $body.addClass('sqmuse-mobile-menu-open');
  });

  $('.Mobile-overlay-nav-item--folder-label').on('click', function () {
    var parent = $(this).parents('.Mobile-overlay-nav-item--folder');
    if ( parent.hasClass('sqmuse-submenu-active') ) {
      parent.removeClass('sqmuse-submenu-active');
      //parent.find('.submenu').slideUp();
      parent.find('.sqmuse-submenu-open').removeClass('sqmuse-submenu-open');
      return;
    }

    parent.addClass('sqmuse-submenu-active');
    parent.find('.submenu').addClass('sqmuse-submenu-open');
    //parent.find('.submenu').slideDown();
  });

    $('section[id^="addon-services"] .summary-title a, section[id^="addon-services-boxes"] a.product-title').each(function () {
      $(this).attr("href", "#");
    });

    $('section[id^="recent-launches"] .summary-item').each(function () {
        var href = $(this).find('.summary-excerpt a').attr('href');
        if (href != null && href != 'undefined') {
            $(this).find( ".summary-title a" ).attr("href", href);
            $(this).find( ".summary-title a" ).attr("target", "_blank");
            $(this).find( ".summary-thumbnail-container" ).attr("href", href);
            $(this).find( ".summary-thumbnail-container" ).attr("target", "_blank");
        }
    });
    $('section[id^="cols3-recent-launches"] .summary-item').each(function () {
        var href = $(this).find('.summary-excerpt a').attr('href');
        if (href != null && href != 'undefined') {
            $(this).find( ".summary-title a" ).attr("href", href);
            $(this).find( ".summary-title a" ).attr("target", "_blank");
            $(this).find( ".summary-thumbnail-container" ).attr("href", href);
            $(this).find( ".summary-thumbnail-container" ).attr("target", "_blank");
        }
    });


  // showcase page
  $('.flo-showcases .design-kit-filter').click(function(e){
    $('.design-kit-sort').slideToggle();
    $('.design-kit-filter').toggleClass('open');
    $('.top-filter .button-group.filter-button-group button').removeClass('is-checked');
  });

  var $grid = $('.flo-showcases .kits-grid').isotope({
    // options
    itemSelector: '.item',
    transitionDuration: 0
  });

  $('.flo-showcases .filter-button-group').on( 'click', 'button', function() {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
    jQuery('.design-kit-sort').slideToggle( "slow", function() {
        // Animation complete.
    });
    jQuery('.design-kit-filter').removeClass('open');
  });

    // Select all links with hashes
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on('click', function(event) {// Remove links that don't actually link to anything
        //event.preventDefault();
        event.stopPropagation();
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                $('html, body').animate({
                    scrollTop: target.offset().top - 45
                }, 600, function() {
              });
            }
        }
    });

    $('#sticky-menu').theiaStickySidebar({

        // container element
        'containerSelector': '',

        // top/bottom margiin in pixels
        'additionalMarginTop': 80,
        'additionalMarginBottom': 0,
        'updateSidebarHeight': true,
        'minWidth': 0,
        'disableOnResponsiveLayouts': true,
        'sidebarBehavior': 'modern',
        'defaultPosition': 'relative',
        'namespace': 'TSS'

    });
	
	  jQuery("[id^='links-fifty-fifty']").each(function() {
        if ($(this).find(".sqs-col-6:first-child .sqs-block-image").length <=1) {
            var imgbg = $(this).find('.sqs-col-6:first-child .sqs-block-image img').data('image');
            //$(this).find(".sqs-col-6:first-child .sqs-block-image").css('visibility', 'hidden');
            $(this).find(".sqs-col-6:first-child").css('background-image', 'url(' + imgbg + ')');
        }
    });

    // pricing blocks tabs
    $('.sm-pricing-blocks-tabs li').on('click', function () {
      if( $(this).hasClass('active') ) {

      }
      else {
        $(this).parents('ul').find('.active').removeClass('active');
        $(this).addClass('active');
        var image = $(this).attr('data-image');
        $(this).parents('.sm-pricing-blocks-tabs').find('.sm-right-column img').attr('src', image);
      }
    });

  // countdown
  var month = 'Month',
    months = 'Months',
    week = 'Week',
    weeks = 'Weeks',
    day = 'Day',
    days = 'Days',
    hour = 'Hour',
    hours = 'Hours',
    minute = 'Minute',
    minutes = 'Minutes',
    second = 'Second',
    seconds = 'Seconds';

  var counter = $("#counter");
  if (counter.length) {
    var date = counter.attr('date');
    /* date format "2019/09/21" */
    counter.countdown(date, function (event) {
      if (event.offset.totalDays >= 7) {
        var $this = $(this).html(event.strftime(''
          + '<div class="sqmuse-countdown-child"><span class="letters week">%!w:' + week + ',' + weeks + ';</span> <span class="numbers week-nr">%w </span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters days">%!d:' + day + ',' + days + ';</span> <span class="numbers days-nr">%d</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters hours">%!H:' + hour + ',' + hours + ';</span> <span class="numbers hours-nr">%H</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters minutes">%!M:' + minute + ',' + minutes + ';</span> <span class="numbers minutes-nr">%M</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters seconds">%!S:' + second + ',' + seconds + ';</span> <span class="numbers seconds-nr">%S</span></div>'));
      } else if (event.offset.totalDays >= 1) {
        var $this = $(this).html(event.strftime(''
          + '<div class="sqmuse-countdown-child"><span class="letters days">%!d:' + day + ',' + days + ';</span> <span class="numbers days-nr">%d</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters hours">%!H:' + hour + ',' + hours + ';</span> <span class="numbers hours-nr">%H</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters minutes">%!M:' + minute + ',' + minutes + ';</span> <span class="numbers minutes-nr">%M</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters seconds">%!S:' + second + ',' + seconds + ';</span> <span class="numbers seconds-nr">%S</span></div>'));
      } else {
        var $this = $(this).html(event.strftime(''
          + '<div class="sqmuse-countdown-child"><span class="letters hours">%!H:' + hour + ',' + hours + ';</span> <span class="numbers hours-nr">%H</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters minutes">%!M:' + minute + ',' + minutes + ';</span> <span class="numbers minutes-nr">%M</span></div>'
          + '<div class="sqmuse-countdown-child"><span class="letters seconds">%!S:' + second + ',' + seconds + ';</span> <span class="numbers seconds-nr">%S</span></div>'));
      }
    });
  }

  // after submit maichimp form redirect to some custom thank you page
  $('#mc-embedded-subscribe-form, #mc-embedded-subscribe-form-center').on('submit', function () {
    var email = $(this).find('#mce-EMAIL');
    if (!email.hasClass('mce_inline_error')) {
      setTimeout( function () {
        location.href = 'https://squaremuse.com/thank-you-newsletter/';
      }, 2000);
    }
  });
});

$(document).ready(function() {
  smCopyToClipboad();
});

function smCopyToClipboad() {
  $('pre.source-code').parents('.sqs-block-content').prepend('<button class="sm-btn" data-clipboard-snippet="">Copy this code</button>');

  new ClipboardJS('.sm-btn', {
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
  });
}

$(document).ready(function() {
  faq_section();
});

function faq_section() {
  $('[id^="faq-section"] h2').on('click', function () {
    var hiddenContent = $(this).parents('li').find('p');
    var current_li = $(this).parents('li');
    if ( current_li.hasClass('active') ) {
      current_li.removeClass('active');
      hiddenContent.slideUp();
    }
    else {
      current_li.addClass('active');
      hiddenContent.slideDown();
    }
  });
}

Y.on('domready', function() {
  setTimeout( function () {
    pricing_slider();
  }, 1000);
});

function pricing_slider() {
  /* pricing kit blocks slider */
  var pricingKitSlider = $('.sm-pricing-kit-blocks .summary-item-list');
  if( pricingKitSlider.length ) {
    var numberSlides = pricingKitSlider.find('.summary-item').length;
    pricingKitSlider.slick({
      slide: '.summary-item',
      arrows: false,
      dots: true,
      infinite: true,
      centerMode: false,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 6000,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
          }
        }
      ]
    }).on('afterChange', function(event, slick, currentSlide, nextSlide){
      // current slide pagination
      pricingKitSlider.find('.sm-slider-pagination-current').html(currentSlide + 1);
    });

    // dynamic pagination
    pricingKitSlider.find('.slick-list').after('<div class="sm-slider-pagination"><span class="sm-slider-pagination-current">1</span> / '+numberSlides+'</div>');
  }
}

Y.on('domready', function() {
  setTimeout( function () {
    elementsSlider();
  }, 1000);
});

function elementsSlider() {
  /* elements slider */
  var elementsSlider = $('[id^="elements-slider"] .summary-item-list');
  if( elementsSlider.length ) {
    elementsSlider.slick({
      slide: '.summary-item',
      arrows: true,
      dots: true,
      infinite: true,
      centerMode: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 6000,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
          }
        }
      ]
    })
  }
}

