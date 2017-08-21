$(function() {
  var map = new BMap.Map("map");
  var goWay = null;
  var searchWay = true; //true 搜地点
  initMap();
  initElements();


  function initMap() {
    var opts = {
      offset: new BMap.Size(30, 50),
      type: BMAP_NAVIGATION_CONTROL_LARGE
    }
    var opts_left = {
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      offset: new BMap.Size(30, 150),
      type: BMAP_NAVIGATION_CONTROL_LARGE
    }
    map.centerAndZoom("成都", 10);
    var MapTypeControl = new BMap.MapTypeControl(opts);
    map.addControl(MapTypeControl);
    var NavigationControl = new BMap.NavigationControl(opts_left);
    map.addControl(NavigationControl);

    map.enableScrollWheelZoom();
    map.enableDoubleClickZoom();

  }

  function initElements() {
    $('#route_btn').click(function() {
      $('#change_route').slideDown();
      if (searchWay) {
        searchWay = false;
        $('#input_search_place').val("");
        $('#result_display').show();
      }
      //console.log(searchWay);
    })

    $('#close_btn').click(function() {
      $('#change_route').slideUp();
      if (!searchWay) {
        searchWay = true;
        $('#result_display').hide();
      }
      //console.log(searchWay);
    })

    $('.route-bar').on('mosueenter', '.iconfont', function() {
      $(this).siblings().css('color', '#ccc');
      $(this).css('color', '#2e77e5');
    })

    $('.route-bar').on('click', '.iconfont', function() {
      //console.log(this.index);
      goWay = $(this).attr('index');
      console.log(goWay);
      $(this).siblings().css('color', '#ccc');
      $(this).css('color', '#2e77e5');
      if (goWay == 'walk') {
        $('#arrow').animate({

          left: '45px'
        })
      } else if (goWay == 'car') {
        $('#arrow').animate({

          left: '145px'
        })
      } else {
        $('#arrow').animate({

          left: '245px'
        })
      }

    })

    $('#route_exchange').click(function() {
      //console.log();
      if ($('#input_start_place').val() != "" && $('#input_end_place').val() != "") {
        var temp;
        temp = $('#input_end_place').val();
        $('#input_end_place').val($('#input_start_place').val());
        $('#input_start_place').val(temp);
      } else {
        alert('未输入起始位置！');
      }

    })

    map.addEventListener('click', function(event) {
      var myGeo = new BMap.Geocoder();
      myGeo.getLocation(event.point, function(add) {
        var addComp = add.address;
        var infoWindow = new BMap.InfoWindow(addComp);
        map.openInfoWindow(infoWindow, event.point);
      })
    })

    $('#search_btn').click(function() {
      if (searchWay) {
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint($('#input_search_place').val(), function(point) {
          if (point) {
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            var info = $('#input_search_place').val();
            var infoWindow = new BMap.InfoWindow(info);
            map.openInfoWindow(infoWindow, point);
            map.centerAndZoom(point, 25);
          } else {
            alert("地址未解析");
          }
        }, '成都')
      } else {
        if (!$('#input_start_place').val() && !$('#input_end_place').val()) {
          console.log(!$('#input_start_place').val());
          alert('请输入起始位置！');

        } else {
          switch (goWay) {
            case null:
              alert('请选择前往方式！');
              break;
            case 'walk':
              walking.search($('#input_start_place').val(), $('#input_end_place').val());
              break;
            case 'bus':
              transit.search($('#input_start_place').val(), $('#input_end_place').val(), BMAP_TRANSIT_POLICY_LEAST_TIME);
              break;
            case 'car':
              driving.search($('#input_start_place').val(), $('#input_end_place').val(), BMAP_DRIVING_POLICY_LEAST_TIME);
          }
        }

      }
    })
  }
  var walking = new BMap.WalkingRoute(map, {
    renderOptions: {
      map: map, //路线显示的地图
      autoViewport: true, //自动调整视野
      panel: 'result_display'
    }
  })
  var transit = new BMap.TransitRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true,
      panel: "result_display",
    }
  })
  var driving = new BMap.DrivingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true,
      panel: "result_display",
    }
  })

  Notification.requestPermission(function(status) {
    console.log(status);
  })
  var notification = new Notification("注意啦！！", {
    body: "本项目仅在成都范围内使用！！！！"
  })

})
