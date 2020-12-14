'use strict';

let multiItemSlider = (function () {
    function isElementVisible(element) {
      let rect = element.getBoundingClientRect(),
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
      let
        mainElement = element,
        sliderWrapper = mainElement.querySelector('.slider-wrapper'),
        sliderItems = mainElement.querySelectorAll('.slider-item'),
        sliderControls = mainElement.querySelectorAll('.slider-control'),
        sliderControlLeft = mainElement.querySelector('.slider-control-left'),
        sliderControlRight = mainElement.querySelector('.slider-control-right'),
        wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width),
        itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width),
        html = mainElement.innerHTML,
        indexIndicator = 0,
        maxIndexIndicator = sliderItems.length - 1,
        indicatorItems,
        positionLeftItem = 0,
        transform = 0,
        step = itemWidth / wrapperWidth * 100,
        items = [],
        interval = 0,
        states = [
          { active: false, minWidth: 0, count: 1 },
          { active: false, minWidth: 576, count: 2 },
          { active: false, minWidth: 992, count: 3 },
          { active: false, minWidth: 1200, count: 4 },
        ];
        config = {
          isCycling: false,
          direction: 'right',
          interval: 5000,
          pause: true
        };

      for (let key in config) {
        if (key in config) {
          config[key] = config[key];
        }
      }

      sliderItems.forEach(function (item, index) {
        items.push({ item: item, position: index, transform: 0 });
      });

      let setActive = function () {
        let index = 0;
        let width = parseFloat(document.body.clientWidth);
        states.forEach(function (item, index, arr) {
          states[index].active = false;
          if (width >= states[index].minWidth)
            index = index;
        });
        states[index].active = true;
      }

      let getActive = function () {
        let index;
        states.forEach(function (item, index, arr) {
          if (states[index].active) {
            index = index;
          }
        });
        return index;
      }

      let position = {
        getItemMin: function () {
          let indexItem = 0;
          items.forEach(function (item, index) {
            if (item.position < items[indexItem].position) {
              indexItem = index;
            }
          });
          return indexItem;
        },
        getItemMax: function () {
          let indexItem = 0;
          items.forEach(function (item, index) {
            if (item.position > items[indexItem].position) {
              indexItem = index;
            }
          });
          return indexItem;
        },
        getMin: function () {
          return items[position.getItemMin()].position;
        },
        getMax: function () {
          return items[position.getItemMax()].position;
        }
      }

      let transformItem = function (direction) {
        let nextItem, currentIndicator = indexIndicator;
        if (!isElementVisible(mainElement)) {
          return;
        }
        if (direction === 'right') {
          positionLeftItem++;
          if ((positionLeftItem + wrapperWidth / itemWidth - 1) > position.getMax()) {
            nextItem = position.getItemMin();
            items[nextItem].position = position.getMax() + 1;
            items[nextItem].transform += items.length * 100;
            items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
          }
          transform -= step;
          indexIndicator = indexIndicator + 1;
          if (indexIndicator > maxIndexIndicator) {
            indexIndicator = 0;
          }
        }
        if (direction === 'left') {
          positionLeftItem--;
          if (positionLeftItem < position.getMin()) {
            nextItem = position.getItemMax();
            items[nextItem].position = position.getMin() - 1;
            items[nextItem].transform -= items.length * 100;
            items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
          }
          transform += step;
          indexIndicator = indexIndicator - 1;
          if (indexIndicator < 0) {
            indexIndicator = maxIndexIndicator;
          }
        }
        sliderWrapper.style.transform = 'translateX(' + transform + '%)';
        indicatorItems[currentIndicator].classList.remove('active');
        indicatorItems[indexIndicator].classList.add('active');
      }

      let slideTo = function (to) {
        let i = 0, direction = (to > indexIndicator) ? 'right' : 'left';
        while (to !== indexIndicator && i <= maxIndexIndicator) {
          transformItem(direction);
          i++;
        }
      }

      let cycle = function (direction) {
        if (!config.isCycling) {
          return;
        }
        interval = setInterval(function () {
          transformItem(direction);
        }, config.interval);
      }

      let controlClick = function (e) {
        if (e.target.classList.contains('slider-control')) {
          e.preventDefault();
          let direction = e.target.classList.contains('slider-control-right') ? 'right' : 'left';
          transformItem(direction);
          clearInterval(interval);
          cycle(config.direction);
        }
        if (e.target.getAttribute('data-slide-to')) {
          e.preventDefault();
          slideTo(parseInt(e.target.getAttribute('data-slide-to')));
          clearInterval(interval);
          cycle(config.direction);
        }
      };

      let handleVisibilityChange = function () {
        if (document.visibilityState === "hidden") {
          clearInterval(interval);
        } else {
          clearInterval(interval);
          cycle(config.direction);
        }
      }

      let refresh = function () {
        clearInterval(interval);
        mainElement.innerHTML = html;
        sliderWrapper = mainElement.querySelector('.slider-wrapper');
        sliderItems = mainElement.querySelectorAll('.slider-item');
        sliderControls = mainElement.querySelectorAll('.slider-control');
        sliderControlLeft = mainElement.querySelector('.slider-control-left');
        sliderControlRight = mainElement.querySelector('.slider-control-right');
        wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width);
        itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width);
        positionLeftItem = 0;
        transform = 0;
        indexIndicator = 0;
        maxIndexIndicator = sliderItems.length - 1;
        step = itemWidth / wrapperWidth * 100;
        items = [];
        sliderItems.forEach(function (item, index) {
          items.push({ item: item, position: index, transform: 0 });
        });
        addIndicators();
      }

      let setUpListeners = function () {
        mainElement.addEventListener('click', controlClick);
        if (config.pause && config.isCycling) {
          mainElement.addEventListener('mouseenter', function () {
            clearInterval(interval);
          });
          mainElement.addEventListener('mouseleave', function () {
            clearInterval(interval);
            cycle(config.direction);
          });
        }

        document.addEventListener('visibilitychange', handleVisibilityChange, false);
        window.addEventListener('resize', function () {
          let
            index = 0,
            width = parseFloat(document.body.clientWidth);
          states.forEach(function (item, index, arr) {
            if (width >= states[index].minWidth)
              index = index;
          });
          if (index !== getActive()) {
            setActive();
            refresh();
          }
        });
      }

      let addIndicators = function () {
        let sliderIndicators = document.createElement('ol');
        sliderIndicators.classList.add('slider-indicators');
        for (let i = 0; i < sliderItems.length; i++) {
          let sliderIndicatorsItem = document.createElement('li');
          if (i === 0) {
            sliderIndicatorsItem.classList.add('active');
          }
          sliderIndicatorsItem.setAttribute("data-slide-to", i);
          sliderIndicators.appendChild(sliderIndicatorsItem);
        }
        mainElement.appendChild(sliderIndicators);
        indicatorItems = mainElement.querySelectorAll('.slider-indicators > li')
      }

      // добавляем индикаторы
      addIndicators();
      // инициализация
      setUpListeners();

      if (document.visibilityState === "visible") {
        cycle(config.direction);
      }
      setActive();

      return {
        right: function () {
          transformItem('right');
        },
        left: function () {
          transformItem('left');
        },
        stop: function () {
          config.isCycling = false;
          clearInterval(interval);
        },
        cycle: function () {
          config.isCycling = true;
          clearInterval(interval);
          cycle();
        }
      }
    }
  }());

//====================End-Slider-Logic======================

const dbUrl = "https://my-json-server.typicode.com/MalumDominum/AnimeInternetShopDb";

let constructor = async function(container) {
  const pageWidth = document.createElement('div');
  pageWidth.classList.add("page-width");
  pageWidth.innerHTML =
  `<div class="slider">
      <div class="slider-wrapper">
      </div>
      <a class="slider-control slider-control-left" href="#" role="button"></a>
      <a class="slider-control slider-control-right" href="#" role="button"></a>
  </div>

  <div class="hit-goods">
      <ul class="grid hit-goods-grid"></ul>
  </div>`;

  await fetch(new Request(dbUrl + '/actions'))
  .then(function(response) {
    return response.blob();
    }).then(async function(blob) {
      let actions = JSON.parse(await blob.text());
      let sliderWrapper = pageWidth.getElementsByClassName("slider-wrapper")[0];
      let actionItems = [];

      for (let i = 0; i < actions.length; i++) {
        actionItems.push(document.createElement("a"));
        actionItems[i].classList.add("slider-item"); 
        actionItems[i].innerHTML =
        `<div href="javascript:;" style="background: center url(${actions[i].photo}); background-size: cover;" data-route="#actions/${actions[i].url}"></div>`;
        sliderWrapper.appendChild(actionItems[i]);
      }

      container.appendChild(pageWidth);
  });


  multiItemSlider(pageWidth.getElementsByClassName('slider')[0], {
      isCycling: true
  });
  


  await fetch(new Request(dbUrl + '/products?recommended=true'))
  .then(function(response) {
    return response.blob();
    }).then(async function(blob) {
      let recommendedProducts = JSON.parse(await blob.text());
      let hitGoods = pageWidth.getElementsByClassName("hit-goods-grid")[0];
      let goods = [];
      // Shuffle array
      recommendedProducts = recommendedProducts.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      recommendedProducts = recommendedProducts.slice(0, 8);
      for (let i = 0; i < 8; i++) {
        goods.push(document.createElement("li"));
        if (i < 6) { goods[i].classList.add("hit-goods-grid-container", "one-third"); }
        else { goods[i].classList.add("hit-goods-grid-container", "one-half"); }
        goods[i].innerHTML =
        `<a href="javascript:;" class="hit-goods-grid-item" data-route="#products/${recommendedProducts[i].url}">
          <div class="hit-goods-grid-item-image" style="background-image: url(product-photos/${recommendedProducts[i].images[0]});"></div>
          <div class="hit-goods-grid-item-text-container">
            <h3 class="hit-goods-grid-item-title">${recommendedProducts[i].name}</h3>
          </div>
        </a>`;

        hitGoods.appendChild(goods[i]);
      }
  });
}

export { constructor };

