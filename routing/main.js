'use strict';

var multiItemSlider = (function () {
    function _isElementVisible(element) {
      var rect = element.getBoundingClientRect(),
        vWidth = window.innerWidth || doc.documentElement.clientWidth,
        vHeight = window.innerHeight || doc.documentElement.clientHeight,
        elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
      if (rect.right < 0 || rect.bottom < 0
        || rect.left > vWidth || rect.top > vHeight)
        return false;
      return (
        element.contains(elemFromPoint(rect.left, rect.top))
        || element.contains(elemFromPoint(rect.right, rect.top))
        || element.contains(elemFromPoint(rect.right, rect.bottom))
        || element.contains(elemFromPoint(rect.left, rect.bottom))
      );
    }

    return function (element, config) {
      var
        _mainElement = element,
        _sliderWrapper = _mainElement.querySelector('.slider-wrapper'),
        _sliderItems = _mainElement.querySelectorAll('.slider-item'),
        _sliderControls = _mainElement.querySelectorAll('.slider-control'),
        _sliderControlLeft = _mainElement.querySelector('.slider-control-left'),
        _sliderControlRight = _mainElement.querySelector('.slider-control-right'),
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
        _html = _mainElement.innerHTML,
        _indexIndicator = 0,
        _maxIndexIndicator = _sliderItems.length - 1,
        _indicatorItems,
        _positionLeftItem = 0,
        _transform = 0,
        _step = _itemWidth / _wrapperWidth * 100,
        _items = [],
        _interval = 0,
        _states = [
          { active: false, minWidth: 0, count: 1 },
          { active: false, minWidth: 576, count: 2 },
          { active: false, minWidth: 992, count: 3 },
          { active: false, minWidth: 1200, count: 4 },
        ],
        _config = {
          isCycling: false,
          direction: 'right',
          interval: 5000,
          pause: true
        };

      for (var key in config) {
        if (key in _config) {
          _config[key] = config[key];
        }
      }

      _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
      });

      var _setActive = function () {
        var _index = 0;
        var width = parseFloat(document.body.clientWidth);
        _states.forEach(function (item, index, arr) {
          _states[index].active = false;
          if (width >= _states[index].minWidth)
            _index = index;
        });
        _states[_index].active = true;
      }

      var _getActive = function () {
        var _index;
        _states.forEach(function (item, index, arr) {
          if (_states[index].active) {
            _index = index;
          }
        });
        return _index;
      }

      var position = {
        getItemMin: function () {
          var indexItem = 0;
          _items.forEach(function (item, index) {
            if (item.position < _items[indexItem].position) {
              indexItem = index;
            }
          });
          return indexItem;
        },
        getItemMax: function () {
          var indexItem = 0;
          _items.forEach(function (item, index) {
            if (item.position > _items[indexItem].position) {
              indexItem = index;
            }
          });
          return indexItem;
        },
        getMin: function () {
          return _items[position.getItemMin()].position;
        },
        getMax: function () {
          return _items[position.getItemMax()].position;
        }
      }

      var _transformItem = function (direction) {
        var nextItem, currentIndicator = _indexIndicator;
        if (!_isElementVisible(_mainElement)) {
          return;
        }
        if (direction === 'right') {
          _positionLeftItem++;
          if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
            nextItem = position.getItemMin();
            _items[nextItem].position = position.getMax() + 1;
            _items[nextItem].transform += _items.length * 100;
            _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
          }
          _transform -= _step;
          _indexIndicator = _indexIndicator + 1;
          if (_indexIndicator > _maxIndexIndicator) {
            _indexIndicator = 0;
          }
        }
        if (direction === 'left') {
          _positionLeftItem--;
          if (_positionLeftItem < position.getMin()) {
            nextItem = position.getItemMax();
            _items[nextItem].position = position.getMin() - 1;
            _items[nextItem].transform -= _items.length * 100;
            _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
          }
          _transform += _step;
          _indexIndicator = _indexIndicator - 1;
          if (_indexIndicator < 0) {
            _indexIndicator = _maxIndexIndicator;
          }
        }
        _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        _indicatorItems[currentIndicator].classList.remove('active');
        _indicatorItems[_indexIndicator].classList.add('active');
      }

      var _slideTo = function (to) {
        var i = 0, direction = (to > _indexIndicator) ? 'right' : 'left';
        while (to !== _indexIndicator && i <= _maxIndexIndicator) {
          _transformItem(direction);
          i++;
        }
      }

      var _cycle = function (direction) {
        if (!_config.isCycling) {
          return;
        }
        _interval = setInterval(function () {
          _transformItem(direction);
        }, _config.interval);
      }

      var _controlClick = function (e) {
        if (e.target.classList.contains('slider-control')) {
          e.preventDefault();
          var direction = e.target.classList.contains('slider-control-right') ? 'right' : 'left';
          _transformItem(direction);
          clearInterval(_interval);
          _cycle(_config.direction);
        }
        if (e.target.getAttribute('data-slide-to')) {
          e.preventDefault();
          _slideTo(parseInt(e.target.getAttribute('data-slide-to')));
          clearInterval(_interval);
          _cycle(_config.direction);
        }
      };

      var _handleVisibilityChange = function () {
        if (document.visibilityState === "hidden") {
          clearInterval(_interval);
        } else {
          clearInterval(_interval);
          _cycle(_config.direction);
        }
      }

      var _refresh = function () {
        clearInterval(_interval);
        _mainElement.innerHTML = _html;
        _sliderWrapper = _mainElement.querySelector('.slider-wrapper');
        _sliderItems = _mainElement.querySelectorAll('.slider-item');
        _sliderControls = _mainElement.querySelectorAll('.slider-control');
        _sliderControlLeft = _mainElement.querySelector('.slider-control-left');
        _sliderControlRight = _mainElement.querySelector('.slider-control-right');
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
        _positionLeftItem = 0;
        _transform = 0;
        _indexIndicator = 0;
        _maxIndexIndicator = _sliderItems.length - 1;
        _step = _itemWidth / _wrapperWidth * 100;
        _items = [];
        _sliderItems.forEach(function (item, index) {
          _items.push({ item: item, position: index, transform: 0 });
        });
        _addIndicators();
      }

      var _setUpListeners = function () {
        _mainElement.addEventListener('click', _controlClick);
        if (_config.pause && _config.isCycling) {
          _mainElement.addEventListener('mouseenter', function () {
            clearInterval(_interval);
          });
          _mainElement.addEventListener('mouseleave', function () {
            clearInterval(_interval);
            _cycle(_config.direction);
          });
        }

        document.addEventListener('visibilitychange', _handleVisibilityChange, false);
        window.addEventListener('resize', function () {
          var
            _index = 0,
            width = parseFloat(document.body.clientWidth);
          _states.forEach(function (item, index, arr) {
            if (width >= _states[index].minWidth)
              _index = index;
          });
          if (_index !== _getActive()) {
            _setActive();
            _refresh();
          }
        });
      }

      var _addIndicators = function () {
        var sliderIndicators = document.createElement('ol');
        sliderIndicators.classList.add('slider-indicators');
        for (var i = 0; i < _sliderItems.length; i++) {
          var sliderIndicatorsItem = document.createElement('li');
          if (i === 0) {
            sliderIndicatorsItem.classList.add('active');
          }
          sliderIndicatorsItem.setAttribute("data-slide-to", i);
          sliderIndicators.appendChild(sliderIndicatorsItem);
        }
        _mainElement.appendChild(sliderIndicators);
        _indicatorItems = _mainElement.querySelectorAll('.slider-indicators > li')
      }

      // добавляем индикаторы
      _addIndicators();
      // инициализация
      _setUpListeners();

      if (document.visibilityState === "visible") {
        _cycle(_config.direction);
      }
      _setActive();

      return {
        right: function () {
          _transformItem('right');
        },
        left: function () {
          _transformItem('left');
        },
        stop: function () {
          _config.isCycling = false;
          clearInterval(_interval);
        },
        cycle: function () {
          _config.isCycling = true;
          clearInterval(_interval);
          _cycle();
        }
      }
    }
  }());

//====================End-Slider-Logic======================

const request = new Request(
    "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io/products");

const pageWidth = document.createElement('div');
pageWidth.classList.add("page-width");
pageWidth.innerHTML =
`<div class="slider">
    <div class="slider-wrapper">
        <a class="slider-item">
        <div style="background: center url(slider-content/autumn-sales.jpg); background-size: cover;"></div>
        </a>
        <a class="slider-item">
        <div style="background: center url(slider-content/halloween-sales.jpg); background-size: cover;"></div>
        </a>
        <a class="slider-item">
        <div style="background: center url(slider-content/giveaway.jpg); background-size: cover;"></div>
        </a>
        <a class="slider-item">
        <div style="background: center url(slider-content/black-friday.jpg); background-size: cover;"></div>
        </a>
    </div>
    <a class="slider-control slider-control-left" href="#" role="button"></a>
    <a class="slider-control slider-control-right" href="#" role="button"></a>
</div>

<div class="hit-goods">
    <ul class="grid hit-goods-grid"></ul>
</div>`

let appendEvents = function() {
    multiItemSlider(pageWidth.getElementsByClassName('slider')[0], {
        isCycling: true
    });
}

fetch(request)
.then(function(response) {
  return response.blob();
}).then(async function(blob) {
  const products = JSON.parse(await blob.text());
  let hitGoods = pageWidth.getElementsByClassName("hit-goods-grid")[0];
  let goods = [];
  let max = Math.floor(products.count);
  for(let i = 0; i < 8; i++) {
    //let randomProduct = products[Math.floor(Math.random() * max)];
    goods.push(document.createElement("li"));
    if (i < 6) { goods[i].classList.add("hit-goods-grid-container", "one-third"); }
    else { goods[i].classList.add("hit-goods-grid-container", "one-half"); }
    goods[i].innerHTML =
   `<a class="hit-goods-grid-item" data-route="#product/${products[i].url}">
      <div class="hit-goods-grid-item-image" style="background-image: url(product-photos/figures/original/${products[i].images[0]});"></div>
      <div class="hit-goods-grid-item-text-container">
        <h3 class="hit-goods-grid-item-title">${products[i].name}</h3>
      </div>
    </a>`;
    goods[i].querySelector('[data-route]').addEventListener('click', function(e) {
      // routeLogic(this);
    });

    goods[i].querySelector('[data-route]').onmouseup = function(e) {
      var e = e || window.event;
      var btnCode = e.button;
      if (btnCode === 1)
       console.log('Middle button');
    }

    hitGoods.appendChild(goods[i]);
  }
});

export { pageWidth, appendEvents };

