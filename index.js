$(document).ready(function () {

  var addTrigger = $('.btn--add'),
      orderTrigger = $('.btn--order'),
      cart = $('.cart'),
      sum,
      firstInit,
      array = [{"txt":"Пакет видеопрограмм","price":1990,"quantity":0},{"txt":"Фотостудия Movavi","price":1890,"quantity":0},{"txt":"Movavi Фоторедактор","price":990,"quantity":0},{"txt":"Movavi Пакетный фоторедактор","price":490,"quantity":0},{"txt":"Захват видео с экрана","price":1490,"quantity":0}];
      if(window.name == '') {
        var cartData = [];
        firstInit = true;
      } else {
        firstInit = false;
        var cartData = JSON.parse(window.name);
      }

  function initStickyCart() {
    var st = $(window).scrollTop();
    var ot = cart.offset().top;
    if(st > ot) {
      cart.addClass('cart--sticky');
    }
     if(st < 140) {
      cart.removeClass('cart--sticky');
    }
  }

  $(window).scroll(initStickyCart);

  addTrigger.click(function() {
    addToCart(this,initDeleteListener)
  });

  function initDeleteListener() {
    $('.delete-btn').off('click');
    $('.delete-btn').click(function() {
      var value = $(this).attr('data-price');
      removeFromCart(value,this);
    });
  }

  function renderCart(data) {
    if(data.length < 1) {
      $('.cart').toggleClass('cart--empty');
    }

    for (var i = 0; i < data.length; i++) {
      item = data[i];
      renderCartItem(item);
    }
    initDeleteListener();
    caluculate();
  }

  renderCart(cartData);

  function renderCartItem(cartItem) {
    for (var variable in cartItem) {
      var elem =  '<div class="cart__list--item"><i class="delete-btn" data-price="'+cartItem.price+'"></i>'+
                  '<span>'+cartItem.txt+'<b> x('+cartItem.quantity+')</b>'+'</span>'+
                  '<span><b>'+ cartItem.price * Number(cartItem.quantity) +'&nbsp;руб.</b></span>'+
                  '</div>';
    }
    $('.cart__list').append(elem);
  }



  function addToCart(that,callback) {
    if($('.cart').hasClass('cart--empty')) {
      $('.cart').toggleClass('cart--empty');
    }

    var index = $(that).attr('data-index');

    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      if(i == index) {
        for (var k = 0; k < cartData.length; k++) {
          if(cartData[k].price == obj.price) {
            cartData[k].quantity++;
            $('.delete-btn').filter("[data-price='"+ cartData[k].price +"']").closest('.cart__list--item').remove();
            renderCartItem(cartData[k]);
            caluculate();
            callback();
            window.name = JSON.stringify(cartData);
            return;
          }
        }
        obj.quantity = 1;
        renderCartItem(obj);
        callback();
        cartData.push(obj);
        caluculate();
        window.name = JSON.stringify(cartData);
        return;
      }
    }
  }

  function removeFromCart(value,that) {

    $(that).closest('.cart__list--item').remove();

    for (var i = 0; i < cartData.length; i++) {
      if(cartData[i].price == value) {
        cartData.splice(i, 1);
        break;
      }
    }
    if(cartData.length < 1) {
      $('.cart').addClass('cart--empty');
    }
    caluculate();
    window.name = JSON.stringify(cartData);
  }


  function caluculate() {
    sum = 0;
    for (var i = 0; i < cartData.length; i++) {
      sum = sum + cartData[i].price*cartData[i].quantity;
    }
    $('.cart__total span').html('Всего: <b>'+ sum +'&nbsp;руб.</b>')
  }

  orderTrigger.click(function() {
    var itemList ='';
    for (var i = 0; i < cartData.length; i++) {
      itemList += cartData[i].txt+'(x'+cartData[i].quantity+');';
    }

    sum == 0 ? alert('Вы ещё не добавили в карзину ни одного продукта!') : alert('Вы добавили в корзину [' +itemList+ '] на сумму ' + sum +' руб.');
  });


})
