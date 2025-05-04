(function ($) {
  fetch('./assets/json/languages.json')
    .then((response) => response.json())
    .then((data) => {
      window.LANGUAGE_DATA = data;
      const savedLang = localStorage.getItem('lang') || 'EN';
      loadsLanguage(savedLang);
    });
  fetch('./assets/json/jobs.json')
    .then((response) => response.json())
    .then((jobs) => {
      window.JOB_DATA = jobs;
      renderJobContent()
    });
  function loadsLanguage(lang) {
    localStorage.setItem('lang', lang);
    $('#country_select').val(lang);
    $('#country_select_mobile').val(lang);
    //check if lang value is DU, show nl address with id nl-address
    if (lang === 'DU') {
      $('#vn-address').addClass('hidden');
      $('#nl-address').removeClass('hidden');
    } else {
      $('#vn-address').removeClass('hidden');
      // $('#nl-address').addClass('hidden');
    }
    $('[data-placeholder-key]').each(function () {
      const placeholderKey = $(this).data('placeholder-key');
      const placeholderText =
        window.LANGUAGE_DATA['WORDS_' + lang]['placeholders'][placeholderKey];
      $(this).attr('placeholder', placeholderText);
    });
    /*fills all tags with class=lang pattern*/
    $('[lang^="lang"]').each(function () {
      let LangVar = $(this).attr('lang').replace('lang-', '');
      const [page, key] = LangVar.split('-');
      let Text = window.LANGUAGE_DATA['WORDS_' + lang][page][key];
      $(this).text(Text);
    });
    renderJobContent();
  }
  function renderJobContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const pathname = window.location.pathname;

    const savedLang = localStorage.getItem('lang') || 'EN';
    if (pathname.includes('job-post')) {
      const jobListContainer = document.getElementById('job-list');
      const jobList = window.JOB_DATA['WORDS_' + savedLang];
      console.log(jobList);
      jobListContainer.innerHTML = ''
      jobList.forEach((job) => {
        const jobCard = `
            <div class="col-lg-4 col-md-6">
              <div class="job-post-box">
                <p class="tag">${job.tag}</p>
                <div class="job-owners-area">
                  <div class="image">
                    <img src="${job.image}" alt="${job.title}" />
                  </div>
                  <div class="text">
                    <a href="#">${job.company}</a>
                    <p>${job.location}</p>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="work-info">
                  <h5>${job.title}</h5>
                  <h6>${job.salary}</h6>
                </div>
                <div class="button">
                  <a class="job-learn" href="job-details.html?jobId=${job.id}" lang="lang-job-view_detail">
                    View Details <span><i class="fa-solid fa-arrow-right"></i></span>
                  </a>
                </div>
              </div>
            </div>
          `;
        // Append the job card to the container
        jobListContainer.innerHTML += jobCard;
      });
    }
    // Find the job with the matching ID
    if (pathname.includes('job-details')) {
      const job = window.JOB_DATA['WORDS_' + savedLang].find(
        (job) => job.id === jobId
      );
      if (job) {
        // Populate the page with job data
        document.querySelector('.main-heading h1').textContent = job.title;
        document.querySelector('.tags-area .tag').textContent = job.tag;
        document.querySelector('.tags-area .salary').textContent = job.salary;
        document.querySelector('.tags-area .address').textContent =
          job.location;
        document.querySelector('.job-description').textContent =
          job.description;

        // Populate responsibilities
        const responsibilitiesList = document.querySelector(
          '.job-details-responsibilities ul'
        );
        responsibilitiesList.innerHTML = job.responsibilities
          .map(
            (item) =>
              `<li><span><i class="fa-solid fa-check"></i></span> ${item}</li>`
          )
          .join('');

        // Populate requirements
        const requirementsList = document.querySelector(
          '.job-details-requirements ul'
        );
        requirementsList.innerHTML = job.requirements
          .map(
            (item) =>
              `<li><span><i class="fa-solid fa-check"></i></span> ${item}</li>`
          )
          .join('');

        // Populate perks
        const perksList = document.querySelector('.job-details-benefits ul');
        perksList.innerHTML = job.perks
          .map(
            (item) =>
              `<li><span><i class="fa-solid fa-check"></i></span> ${item}</li>`
          )
          .join('');
      } else {
        // Handle case where jobId is not found
        document.querySelector('.main-heading h1').textContent =
          'Job Not Found';
      }
    }
    if (!jobId && pathname.includes('job-details')) {
      console.log('vao');
      // Handle case where jobId is missing
      document.querySelector('.main-heading h1').textContent =
        'No Job Selected';
    }
  }
  emailjs.init('zzWmcxOnIDk3EoPkJ');
  $(document).ready(function () {
    const form =
      document.getElementById('contact-form') ||
      document.getElementById('subscribe-form');
    form?.addEventListener('submit', function (event) {
      event.preventDefault();
      const submitButton = this.querySelector('#submit-button');

      submitButton.disabled = true;
      submitButton.innerHTML =
        'Submitting... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      // these IDs from the previous steps
      emailjs.sendForm('service_86lo5hw', 'template_rb8f669', this).then(
        () => {
          console.log('SUCCESS!');
          const popup = document.getElementById('success-popup');
          popup.classList.remove('hidden');

          // Close the pop-up when the close button is clicked
          document
            .getElementById('close-popup')
            .addEventListener('click', () => {
              popup.classList.add('hidden');
            });
          this.reset();
          submitButton.disabled = false;
          submitButton.innerHTML = 'Submit Now';
        },
        (error) => {
          console.log('FAILED...', error);
        }
      );
    });
    var $dropdown = $('#country_select');

    // Initialize the language loader with the default language
    // $.each(LanguageList, function (key, value) {
    //   $dropdown.append($('<option/>').val(key).text(value));
    // });
    const savedLang = localStorage.getItem('lang') || 'EN';
    $dropdown.val(savedLang);
    $('#country_select_mobile').val(savedLang);
    // sticky header active
    if ($('#header').length > 0) {
      $(window).on('scroll', function (event) {
        var scroll = $(window).scrollTop();
        if (scroll < 1) {
          $('#header').removeClass('sticky');
        } else {
          $('#header').addClass('sticky');
        }
      });
    }

    // pricing-plan-tab
    $('#ce-toggle').click(function (event) {
      $('.plan-toggle-wrap').toggleClass('active');
    });

    $('#ce-toggle').change(function () {
      if ($(this).is(':checked')) {
        $('.tab-content #yearly').hide();
        $('.tab-content #monthly').show();
      } else {
        $('.tab-content #yearly').show();
        $('.tab-content #monthly').hide();
      }
    });

    $('.header-search-btn').on('click', function (e) {
      e.preventDefault();
      $('.header-search-form-wrapper').addClass('open');
      $('.header-search-form-wrapper input[type="search"]').focus();
      $('.body-overlay').addClass('active');
    });
    $('.tx-search-close').on('click', function (e) {
      e.preventDefault();
      $('.header-search-form-wrapper').removeClass('open');
      $('body').removeClass('active');
      $('.body-overlay').removeClass('active');
    });

    //=== logo slider ===
    $('.logo-slider').slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 8000,
      pauseOnHover: true,
      arrows: false,
      cssEase: 'linear',

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    //=== logo slider ===
    $('.logo-slider3').slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 12000,
      pauseOnHover: true,
      arrows: false,
      cssEase: 'linear',
      responsive: {
        0: {
          items: 2
        },
        768: {
          items: 4
        },
        992: {
          items: 4
        },
        1200: {
          items: 6
        }
      }
    });

    //=== logo slider ===
    $('.logo-slider4').slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 8000,
      pauseOnHover: true,
      arrows: false,
      cssEase: 'linear',

      responsive: {
        0: {
          items: 2
        },
        768: {
          items: 2
        },
        992: {
          items: 2
        },
        1200: {
          items: 2
        }
      }
    });

    // project style1
    if ($('.project-two__box li').length) {
      $('.project-two__box li').each(function () {
        let self = $(this);

        self.on('mouseenter', function () {
          console.log($(this));
          $('.project-two__box li').removeClass('active');
          $(this).addClass('active');
        });
      });
    }

    // project style1
    $('.project-two__carousel').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 0,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplayTimeout: 10000,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 1
        },
        992: {
          items: 1
        },
        1200: {
          items: 1
        }
      }
    });

    // case 6
    $('.project-there__carousel').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 0,
      nav: true,
      navText: [
        '<i class="fa-solid fa-angle-left"></i>',
        '<i class="fa-solid fa-angle-right"></i>'
      ],
      dots: false,
      smartSpeed: 500,
      autoplayTimeout: 10000,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 1
        },
        992: {
          items: 1
        },
        1200: {
          items: 1
        }
      }
    });

    $('.tes2-slider').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 0,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplayTimeout: 10000,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 1
        },
        992: {
          items: 1
        },
        1200: {
          items: 1
        }
      }
    });

    //testimonial 6
    $('.tes1-slider').slick({
      autoplay: true,
      autoplaySpeed: 1500,
      margin: '30',
      slidesToShow: 2,
      arrows: true,
      centerMode: false,
      loop: true,
      centerMode: false,
      prevArrow: $('.testimonial-prev-arrow1'),
      nextArrow: $('.testimonial-next-arrow1'),
      draggable: true,
      centerPadding: '40px',
      dots: false,
      scroll: true,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    //service 7
    $('.case7-slider').slick({
      autoplay: true,
      autoplaySpeed: 1500,
      margin: '30',
      slidesToShow: 3,
      arrows: true,
      centerMode: false,
      loop: true,
      centerMode: false,
      prevArrow: $('.case7-prev-arrow1'),
      nextArrow: $('.case7-next-arrow1'),
      draggable: true,
      centerPadding: '40px',
      dots: false,
      scroll: true,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    //service 7
    $('.service7-slider').slick({
      autoplay: true,
      autoplaySpeed: 1500,
      margin: '30',
      slidesToShow: 3,
      arrows: true,
      centerMode: false,
      loop: true,
      centerMode: false,
      prevArrow: $('.service7-prev-arrow1'),
      nextArrow: $('.service7-next-arrow1'),
      draggable: true,
      centerPadding: '40px',
      dots: false,
      scroll: true,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    //testimonial 4
    $('.tes4-slider').slick({
      margin: '30',
      slidesToShow: 3,
      arrows: true,
      centerMode: false,
      loop: true,
      centerMode: false,
      prevArrow: $('.testimonial-prev-arrow1'),
      nextArrow: $('.testimonial-next-arrow1'),
      draggable: true,
      centerPadding: '40px',
      dots: false,
      scroll: true,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    //testimonial 6
    $('.tes6-slider').slick({
      margin: '30',
      slidesToShow: 3,
      arrows: true,
      centerMode: true,
      loop: true,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: false,
      prevArrow: $('.tes6-next-arrow'),
      nextArrow: $('.tes6-prev-arrow'),
      draggable: true,
      fade: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    // testimonial 8//
    $('.slider-galeria').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      infinite: false,
      asNavFor: '.slider-galeria-thumbs',
      prevArrow: $('.testimonial-next-arrow2'),
      nextArrow: $('.testimonial-prev-arrow2')
    });
    $('.slider-galeria-thumbs').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      items: 15,
      arrows: true,
      asNavFor: '.slider-galeria',
      vertical: true,
      verticalSwiping: true,
      focusOnSelect: true,
      infinite: false,
      prevArrow: $('.testimonial-next-arrow2'),
      nextArrow: $('.testimonial-prev-arrow2')
    });

    //testimonial 8
    $('.tes8-slider').slick({
      margin: '30',
      slidesToShow: 1,
      arrows: true,
      centerMode: true,
      loop: true,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: false,
      prevArrow: $('.tes8-next-arrow'),
      nextArrow: $('.tes8-prev-arrow'),
      draggable: true,
      fade: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    //testimonial 8
    $('.hero10-sliders').slick({
      margin: '30',
      slidesToShow: 1,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: true,
      loop: true,
      centerMode: false,
      prevArrow: $('.hero10-next-arrow'),
      nextArrow: $('.hero10-prev-arrow'),
      draggable: true,
      fade: true,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

    /*--------------------------------------------------------------
    17. Hover To Active
  --------------------------------------------------------------*/
    $('.cs_hover_active').hover(function () {
      $(this).addClass('active').siblings().removeClass('active');
    });

    //Aos animation active

    AOS.init({
      offset: 100,
      duration: 400,
      easing: 'ease-in-out',
      anchorPlacement: 'top-bottom',
      disable: 'mobile',
      once: false
    });

    //Video poppup
    if ($('.play-btn').length > 0) {
      $('.play-btn').magnificPopup({
        type: 'iframe'
      });
    }

    // page-progress
    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      'stroke-dashoffset 10ms linear';
    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;
    };
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 50;
    var duration = 550;
    jQuery(window).on('scroll', function () {
      if (jQuery(this).scrollTop() > offset) {
        jQuery('.progress-wrap').addClass('active-progress');
      } else {
        jQuery('.progress-wrap').removeClass('active-progress');
      }
    });
    jQuery('.progress-wrap').on('click', function (event) {
      event.preventDefault();
      jQuery('html, body').animate({ scrollTop: 0 }, duration);
      return false;
    });

    //product colors
    const colors = $('.accordion1 .accordion-item');

    colors.on('click', function () {
      $('.accordion1 .accordion-item').removeClass('active');
      $(this).addClass('active');
    });
  });

  //preloader
  $(window).on('load', function (event) {
    setTimeout(function () {
      $('.preloader').fadeToggle();
    }, 500);
  });

  /* Text Effect Animation */
  if ($('.text-anime-style-1').length) {
    let staggerAmount = 0.05,
      translateXValue = 0,
      delayValue = 0.5,
      animatedTextElements = document.querySelectorAll('.text-anime-style-1');

    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: 'chars, words' });
      gsap.from(animationSplitText.words, {
        duration: 1,
        delay: delayValue,
        x: 20,
        autoAlpha: 0,
        stagger: staggerAmount,
        scrollTrigger: { trigger: element, start: 'top 85%' }
      });
    });
  }

  if ($('.text-anime-style-2').length) {
    let staggerAmount = 0.05,
      translateXValue = 20,
      delayValue = 0.5,
      easeType = 'power2.out',
      animatedTextElements = document.querySelectorAll('.text-anime-style-2');

    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: 'chars, words' });
      gsap.from(animationSplitText.chars, {
        duration: 1,
        delay: delayValue,
        x: translateXValue,
        autoAlpha: 0,
        stagger: staggerAmount,
        ease: easeType,
        scrollTrigger: { trigger: element, start: 'top 85%' }
      });
    });
  }

  if ($('.text-anime-style-3').length) {
    let animatedTextElements = document.querySelectorAll('.text-anime-style-3');

    animatedTextElements.forEach((element) => {
      //Reset if needed
      if (element.animation) {
        element.animation.progress(1).kill();
        element.split.revert();
      }

      element.split = new SplitText(element, {
        type: 'lines,words,chars',
        linesClass: 'split-line'
      });
      gsap.set(element, { perspective: 400 });

      gsap.set(element.split.chars, {
        opacity: 0,
        x: '50'
      });

      element.animation = gsap.to(element.split.chars, {
        scrollTrigger: { trigger: element, start: 'top 95%' },
        x: '0',
        y: '0',
        rotateX: '0',
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: 0.02
      });
    });
  }
  window.loadsLanguage = loadsLanguage;
})(jQuery);

const rippleBtns = document.getElementsByClassName('ripple');

function createRipple(event) {
  // Create the ripple span element
  let ripples = document.createElement('span');

  // Calculate the position relative to the button element
  let x = event.clientX - event.target.getBoundingClientRect().left;
  let y = event.clientY - event.target.getBoundingClientRect().top;

  // Set the position of the ripple within the button element
  ripples.style.left = x + 'px';
  ripples.style.top = y + 'px';

  // Append the ripple to the button
  event.target.appendChild(ripples);

  // Set a timeout to remove the ripple after 1000 milliseconds
  let clearTimeoutHandle = setTimeout(() => {
    ripples.remove();
  }, 1000);

  // Remove the ripple immediately if the mouse leaves the button
  event.target.addEventListener('mouseout', function () {
    clearTimeout(clearTimeoutHandle);
    ripples.remove();
  });
}

// Attach the createRipple function to each button
for (let i = 0; i < rippleBtns.length; i++) {
  const rippleBtn = rippleBtns[i];
  rippleBtn.addEventListener('mouseover', createRipple);
}

// line progress bar

let progress = $('#progress1').LineProgressbar({
  percentage: 100
});

let progress2 = $('#progress2').LineProgressbar({
  percentage: 98
});

let progress3 = $('#progress3').LineProgressbar({
  percentage: 97
});

if ($('.reveal').length) {
  gsap.registerPlugin(ScrollTrigger);
  let revealContainers = document.querySelectorAll('.reveal');
  revealContainers.forEach((container) => {
    let image = container.querySelector('img');
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        toggleActions: 'play none none none'
      }
    });
    tl.set(container, { autoAlpha: 1 });
    tl.from(container, 1.5, { xPercent: -100, ease: Power2.out });
    tl.from(image, 1.5, {
      xPercent: 100,
      scale: 1.3,
      delay: -1.5,
      ease: Power2.out
    });
  });
}
