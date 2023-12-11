$(function() {


    calc();






    $('.calculate-amount').on('change keyup', function() {
        var amount = Number($(this).val() * Math.pow(10, 2)) / Math.pow(10, 2);
        var data = sw();


        if (amount > data.max) {
            amount = data.max;
            $(this).val(amount);
        }


        calc(data, amount);
    }).on('keypress', isNumberKey);





    function isNumberKey(event) {

        var charCode = (event.which) ? event.which : event.keyCode;

        if (charCode == 46) return true;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }


    function sw() {
        data = [];
        data.min = 100;
        data.max = 15000;
        data.percent = 73.50;
        data.daily = 1.60;
        data.daily2 = 1.20;
        data.daily3 = 3.10;
        return data;
    }

    function calc(data, amount) {



        if (jQuery.isEmptyObject(data)) {
            data = sw();
            amount = data.min;

            $('.calculate-amount').val(data.min);


            calculate(amount, data.percent, data.daily, data.daily2, data.daily3);
        }

        calculate(amount, data.percent, data.daily, data.daily2, data.daily3);

    }

    function calculate(amount, percent, daily, daily2, daily3) {

        var amount = Number(amount);
        var daily = Number(daily);
        var daily2 = Number(daily2);
        var daily3 = Number(daily3);
        var percent = Number(percent);



        var meteorday = Math.round((Math.round(amount * daily * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var meteortotal = Math.round((amount + Math.round(amount * 24 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var meteordayreinvest = Math.round((Math.round(amount * 3.4 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var meteortotalreinvest = Math.round((Math.round(amount * 60 * 3.4 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var planetarday = Math.round((Math.round(amount * daily2 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var planetartotal = Math.round((amount + Math.round(amount * 36 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var planetardayreinvest = Math.round((Math.round(amount * 3.7 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var planetartotalreinvest = Math.round((Math.round(amount * 45 * 3.7 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var galaxyday = Math.round((Math.round(amount * daily3 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var galaxytotal = Math.round((Math.round(amount * 45 * daily3 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var galaxydayreinvest = Math.round((Math.round(amount * 4.5 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);
        var galaxytotalreinvest = Math.round((Math.round(amount * 30 * 4.5 * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 4)) * Math.pow(10, 2)).toFixed(0) / Math.pow(10, 2);

        $('.meteor-day').html(meteorday + '<small>$</small>');
        $('.meteor-total').html(meteortotal + '<small>$</small>');
        $('.meteor-day-reinvest').html(meteordayreinvest + '<small>$</small>');
        $('.meteor-total-reinvest').html(meteortotalreinvest + '<small>$</small>');
        $('.planetar-day').html(planetarday + '<small>$</small>');
        $('.planetar-total').html(planetartotal + '<small>$</small>');
        $('.planetar-day-reinvest').html(planetardayreinvest + '<small>$</small>');
        $('.planetar-total-reinvest').html(planetartotalreinvest + '<small>$</small>');
        $('.galaxy-day').html(galaxyday + '<small>$</small>');
        $('.galaxy-total').html(galaxytotal + '<small>$</small>');
        $('.galaxy-day-reinvest').html(galaxydayreinvest + '<small>$</small>');
        $('.galaxy-total-reinvest').html(galaxytotalreinvest + '<small>$</small>');
    }






});