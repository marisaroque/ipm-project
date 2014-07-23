  "use strict";

  jQuery.fn.visibilityToggle = function() {
      return this.css('visibility', function(i, visibility) {
          return (visibility == 'visible') ? 'hidden' : 'visible';
      });
  };

  $(document).ready(function() {


      // Initialize jQuery keyboard navigation
      $(document).keynav();

      // Clock
      $.clock.locale.pt = {
          "weekdays": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
          "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "October", "Novembro", "Dezembro"]
      };
      $("div#clock").clock({
          "langSet": "pt"
      });


      var exampleOdometerValue = 39245;
      $('.odometer')[0].innerHTML = exampleOdometerValue;
      var exampleOdometer = new Odometer({
          el: $('.odometer')[0],
          theme: 'car',
          value: exampleOdometerValue++
      });
      exampleOdometer.render()

      setInterval(function() {
          exampleOdometer.update(exampleOdometerValue++);
      }, 2000);



      var checkboxes = {
          '#check-1': '#gps',
          '#check-2': '#info',
          '#check-3': '#phone',
          '#check-4': '#status',
          '#check-5': '#media',
          '#check-6': '#environment'
      };
      for (var key_loop in checkboxes) {
          $(key_loop).prop('checked', true);

          (function(key) {
              $(key).change(function() {
                  $(checkboxes[key]).toggleClass('disabled');
                  // comment to change the method of visibility       
                  $(checkboxes[key]).visibilityToggle();
              });
          })(key_loop);
      };


      var metrics = {
          '#fluids': '#fluids-level',
          '#traccao-button': '#traccao',
          '#break-button': '#break',
          '#electricity-button': '#electricity',
          '#statistics-button': '#statistics',
          '#maintenance-button': '#maintenance'
      }
      for (var key in metrics) {
          swap_box_content_more(key, '#buttons1', metrics[key]);
      }
      swap_box_content_more('#insurance-yes-button', '#buttons2', '#insurance-yes');
      swap_box_content_more('#help-button', '#checkboxes', '#help');

      function swap_box_content_more(button, element1, element2) {
          $(button).click(function() {
              $(button).data('keynav', 'stop');
              $(element1).removeClass('box-content-more').addClass('box-content-hidden');
              $(element2).addClass('box-content-more').removeClass('box-content-hidden');
              $(element2).fadeIn();

              $(button).on('deactivated', function() {
                  $(element1).addClass('box-content-more').removeClass('box-content-hidden');
                  $(element2).fadeOut();
                  $(element2).removeClass('box-content-more').addClass('box-content-hidden');
              });
          });
      }

      $('#insurance-no-button').click(function() {
          $.keynav.deactivate();
      });

      $('#buttons2').removeClass('box-content-more').addClass('box-content-hidden');
      $('#buttons1').addClass('box-content-more').removeClass('box-content-hidden');
      $('#buttons1 [data-level="1"]').removeClass('disabled');
      $('#buttons2 [data-level="1"]').addClass('disabled');
      $(document).keypress(function(event) {
          if (event.which == 119) {
              $('#warning').fadeToggle();
              $('#buttons2,#buttons1').toggleClass('box-content-more').toggleClass('box-content-hidden');
              //$('#buttons1').toggleClass('box-content-more').toggleClass('box-content-hidden');

              //$('#buttons1 [data-level="1"]').toggleClass('disabled').removeClass('withfocus');
              //$('#buttons2 [data-level="1"]').toggleClass('disabled').removeClass('withfocus');

              $('#buttons1 [data-level="1"],#buttons2 [data-level="1"]').toggleClass('disabled').removeClass('withfocus');

          }
      });


      var qwe = $('#svganim').svg();
      var qwe = $('#svganim').svg('get');
      var g = qwe.getElementById('speedometer');
      // $(g).animate({  svgTransform: 'rotate(30, 80, 80)'});

      setInterval(function() {
          var seconds = (new Date()).getMilliseconds();
          var offset = 170;
          var divider = 0.5
          var velocity = Math.random() * -80 + Math.random() * 70 * Math.cos(2 * Math.PI * seconds / 1000);

          $(g).animate({
              svgTransform: 'rotate(' + velocity + ', 80, 80)'
          }, 2000);
          setTimeout(function() {
              $('#velocity').text((divider * (velocity + offset)).toFixed(1));
          }, 1000);
      }, 2011);

      // var media = document.getElementById('bg_audio');
      var songs = [{
          url: "media/vinho.mp3",
          artist: "Mariza",
          title: "Sr. Vinho"
      }, {
          url: "media/motorway.mp3",
          artist: "Little Boots",
          title: "Motorway"
      }];
      var current_song = 0;
      var player = new Audio(songs[current_song].url);
      player.play();
      $('#play').click(function() {
          player.play();
      });

      $('#pause').click(function() {
          player.pause();
      });

      $('#next').click(function() {
          player.pause();
          current_song = (current_song + 1) % songs.length;
          player.src = songs[current_song].url;
          player.play();
      });
      $('#previous').click(function() {
          player.pause();
          current_song = (((current_song - 1) % songs.length) + songs.length) % songs.length;
          player.src = songs[current_song].url;
          player.play();
      });

      player.addEventListener('pause', function() {
          if (!$("#stop,#next,#previous").hasClass("withfocus")) {
              $('#play').addClass("withfocus");
              $('#pause').removeClass("withfocus");
          }
          $('#play').show().removeClass("disabled");
          $('#pause').hide().addClass("disabled");
      });

      $('#stop').click(function() {
          player.pause();
          player.currentTime = 0;
      });
      player.addEventListener('timeupdate', function() {
          $('#time').text(seconds_to_timestamp(this.currentTime));
          $('#progress').val(this.currentTime / this.duration * 100);
      });
      player.addEventListener('playing', function() {
          if (!$("#stop,#next,#previous").hasClass("withfocus")) {
              $('#play').removeClass("withfocus");
              $('#pause').addClass("withfocus");
          }
          $('#song-author').text(songs[current_song].artist);
          $('#song-title').text(songs[current_song].title);
          $('#duration').text(seconds_to_timestamp(this.duration));
          $('#pause').show().removeClass("disabled");
          $('#play').hide().addClass("disabled");
      });


      $('#volume-mute').click(function() {
          player.muted = !player.muted;
      });
      $('#volume-down').click(function() {
          if (player.volume <= 0.09) return;
          player.volume -= 0.1;
      });
      $('#volume-up').click(function() {
          if (player.volume >= 0.901) return;
          player.volume += 0.1;
      });


      function seconds_to_timestamp(absolute_seconds) {
          var minutes = Math.floor(absolute_seconds / 60);
          var seconds = absolute_seconds - minutes * 60;
          seconds = seconds > 9 ? "" + seconds.toFixed(0) : "0" + seconds.toFixed(0);
          return minutes + ':' + seconds;
      }



      // background video
      var videobackground = new $.backgroundVideo($('body'), {
        "align": "centerXY",
        "width": 1280,
        "height": 720,
        "path": "media/",
        "filename": "kitt",
        "types": ["mp4","ogg","webm"]
      });


  });
