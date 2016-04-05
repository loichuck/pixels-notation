(function(scope){

    var products = [];
    var criteria = {};
    var container;

    var options = {
        criteria: "[data-criteria]",
        container: ".pxl-products",
        products:  ".pxl-product",
        notation: 100
    };

    var Notation = {
        init: init,
        calculate: calculate
    };

    function createCriteria(i, c){
        var name = c.getAttribute('data-criteria') || '';
        var step = parseInt(c.getAttribute('data-step'), 10) || 4;
        var limit = (c.getAttribute('data-limit') !== null);
        var min = 0;
        var max = options.notation;
        if(limit){
            min = parseInt(c.getAttribute('data-min'), 10) || 0;
            max = parseInt(c.getAttribute('data-max'), 10) || options.notation;
            if(!c.getAttribute('data-step'))
                step = max - min;
        }
        criteria[name] = new Range(c, calculate, step, limit, min, max);
    }

    function createProduct(i, product){
        var crits = {};
        forIn(criteria, function(i, c){
            crits[i] = parseInt(product.getAttribute('data-criteria-'+i), 10) || 0;
        });

        products.push({
            criteria: crits,
            elem: product,
            canvas: product.querySelector('canvas'),
            value: 0,
            note: product.querySelector('.pxl-product-note')
        });
    }

    function init(_options){
        if(typeof _options === 'object')
            extend(options, _options);

        container = document.querySelector(options.container);
        forEach(document.querySelectorAll(options.criteria), createCriteria);
        forEach(document.querySelectorAll(options.products), createProduct);

        calculate();
        return Notation;
    }

    function calculate(){
        var criteriaLength = 0;
        var limit = [];

        forIn(criteria, function(i, c){
            if(!c.limit)
                criteriaLength += c.value;
        });

        forEach(products, function(i, product){
            var note = 0;
            forIn(product.criteria, function(i, c){
                var crit = criteria[i];
                if(crit){
                    if(crit.limit){
                        if(crit.scaledValue < c){
                            note = 0;
                            return false;
                        }
                    } else {
                        note += c * crit.value;
                    }
                }
            });
            product.value = roundDecimal(note/criteriaLength, 10) || 0;
            if(product.note)
                product.note.innerHTML = product.value;
            if(product.canvas)
                chart(product.canvas, product.value/options.notation, "#06b586");
        });

        sort(products);
    }

    function sort(prdtcs){
        prdtcs.sort(function(a, b){
            return b.value > a.value;
        });

        forEach(prdtcs, function(i, product){
            if(product.value !== 0){
                container.appendChild(product.elem);
            } else {
                if(product.elem.parentNode === container)
                    container.removeChild(product.elem);
            }
        });
    }

    function roundDecimal(n, decimal){
        decimal = decimal || 10;
        return Math.round(n * decimal) / decimal;
    }

    function extend(a, b){
        forIn(b, function(i, obj){
            a[i] = obj;
        });

        return a;
    }

    function forIn(obj, fn){
        if(typeof fn !== 'function')
            throw new Error('Second argument should be a function');

        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                var retour = fn(prop, obj[prop]);
                if(retour !== undefined)
                    return retour;
            }
        }

        return obj;
    }

    function forEach(arr, fn){
        if(typeof fn !== 'function')
            throw new Error('Second argument should be a function');

        for(var i = 0, l = arr.length; i<l; i++)
            fn(i, arr[i]);

        return arr;
    }

    function appendElement(parent, type, className){
        if(!parent)
            return;
        var elem = document.createElement(type || 'div');
        if(className)
            elem.className = className;
        parent.appendChild(elem);
        return elem;
    }

    function Range(elem, callback, step, limit, min, max){
        this.elem = elem;
        this.limit = limit || false;
        this.min = min || 0;
        this.max = max || options.notation;
        this.handle = appendElement(this.elem, 'div', 'pxl-handle');
        this.jauge = appendElement(this.elem, 'div', 'pxl-jauge');
        this.note = appendElement(this.jauge, 'div', 'pxl-value');
        this.step = step || 100;
        this.value = (limit) ? 1 : 0.5;
        this.scaledValue = 0;
        this.pressed = false;
        this.callback = callback;
        this.elem.addEventListener('mousedown', this.down.bind(this), false);
        window.addEventListener('mouseup', this.up.bind(this), false);
        window.addEventListener('mousemove', this.move.bind(this), false);

        this.range(1 - this.value);
    }

    Range.prototype.down = function (e) {
        e.preventDefault();
        this.pressed = true;
        this.note.style.opacity = 1;
        this.range((e.clientY - this.elem.getBoundingClientRect().top) / this.elem.offsetHeight);
    };

    Range.prototype.up = function (e) {
        e.preventDefault();
        if(!this.pressed)
            return;
        this.note.style.opacity = 0;
        this.range((e.clientY - this.elem.getBoundingClientRect().top) / this.elem.offsetHeight);
        this.pressed = false;
    };

    Range.prototype.move = function (e) {
        e.preventDefault();
        if(!this.pressed)
            return;
        this.range((e.clientY - this.elem.getBoundingClientRect().top) / this.elem.offsetHeight);
    };

    Range.prototype.range = function (pos) {
        this.value = Math.round((1-Math.max(0, Math.min(1, pos)))*this.step)/this.step;
        this.scaledValue = this.value * (this.max - this.min) + this.min;
        this.jauge.style.height = Math.round(this.value*100)+'%';
        this.handle.style.bottom = Math.round(this.value*100)+'%';
        this.note.innerHTML = roundDecimal(this.scaledValue, 10);
        if(typeof this.callback === 'function')
            this.callback(this.value);
    };

    function chart(canvas, pourcent, color){
        var context = canvas.getContext('2d');
        var x = canvas.width*0.5;
        var y = canvas.height*0.5;
        var radius = (x<y)?x:y;
        context.clearRect(0,0,canvas.width,canvas.height);
        context.fillStyle = color || "#000";
        context.beginPath();
        context.arc(x,y,radius,0,Math.PI*2*pourcent);
        context.lineTo(x, y);
        context.fill();
    }

    scope.Notation = Notation;

})(window);
