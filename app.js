var appControlador = (function () {

    var Veiculo = function (id, name, type, date, valor) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.date = date;
        this.valor = valor;
    };

    var data = {
        allItems: {
            m: [],
            f: [],
        },
        totals: {
            m: 0,
            f: 0
        }
    };
    return {
        addVeic: function (type, des, val) {

            var newItem, ID;


            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'm' || type === 'f') {
                newItem = new Veiculo(ID, des, val)
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        
        
    };


})();

// user interface controller
var UIControlador = (function () {

    var DOMstrings = {
        inputID: '.add__valueID',
        inputName: '.add__description',
        inputType: '.add__type',
        inputDate: '.add__date',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        inputCota: '.budget__value',
        inputIncome: '.income__list',
        container: '.container',
        itemsContainer: '.item'
    };
    return {
        getInput: function () {
            return {
                id: document.querySelector(DOMstrings.inputID).value,
                name: document.querySelector(DOMstrings.inputName).value,
                type: document.querySelector(DOMstrings.inputType).value,
                date: document.querySelector(DOMstrings.inputDate).value,
                valor: document.querySelector(DOMstrings.inputValue).value,
                cota: document.querySelector(DOMstrings.inputCota).value,
                income: document.querySelector(DOMstrings.inputIncome).value,
            };

        },
        adicionaLista: function (newItem, id, valor, cota){
            var html, element, newHtml;

            html = '<div class="item clearfix" id="%id%"><div class="item__description"> %total% </div><div class="right clearfix"><div class="item__value" id="item_cota"> %cota% </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            newHtml = html.replace('%id%', id);
            newHtml = newHtml.replace('%total%', valor);
            newHtml = newHtml.replace('%cota%', cota);

            document.querySelector('.income__list').insertAdjacentHTML('beforeend', newHtml);
        },
        deletaLista: function(selectorID){

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        limparCampos: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputName + ', ' + DOMstrings.inputValue + ', ' + DOMstrings.inputDate);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
    };

})();


// global controller
var controlador = (function (appCtrl, UICtrl) {
    var setupEvtList = function () {

        var DOM = UICtrl.getDOMstrings();

        //event do Enter ou click no botão
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddVeic);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {

                ctrlAddVeic();

            }

            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        });


    };

    var getStorageItems = function () {
        var storage = JSON.parse(localStorage.getItem("historico"));
        if (storage !== null) {
            if (storage.itens.length > 0) {
                storage.itens.map(item => UICtrl.adicionaLista('', item.id, item.total, item.cota));
            } else {
                document.querySelector('.income__list').innerHTML = '';
            }
        }
    }

    var getId = function () {
        var DOM = UICtrl.getDOMstrings();
        var storage = JSON.parse(localStorage.getItem("historico"));
        if (storage !== null) {
            document.querySelector(DOM.inputID).value = storage.itens.length + 1;
        } else {
            document.querySelector(DOM.inputID).value = 1;
        }
    }

    var ctrlAddVeic = function () {
        
        var input = UICtrl.getInput();

        if (input.name !== "" && !isNaN(input.valor) && input.valor > 0 && input.date >= 18) {
            //calculo da cota
            if (input.date >= '18' && input.date <= '25') {
                var final = ((input.valor * .03) * 1.1).toFixed(2);
            } else if (input.date >= '26' && input.date <= '30') {
                var final = ((input.valor * .03) * 1.05).toFixed(2);
            } else if (input.date >= '31' && input.date <= '35') {
                var final = ((input.valor * .03) * 1.02).toFixed(2);
            } else if (input.date >= '36') {
                var final = (input.valor * .03).toFixed(2);
            }
            if (input.sexo === 'm') {
                final = (final * 1.1).toFixed(2);
            } else if (input.sexo === 'f') {
                final;
            }
            input.cota = final;

            //display on User Interface
            
            document.getElementById('veic').textContent = (input.valor);
            document.getElementById('cota').textContent = (input.cota);

            var item = {
                id: input.id,
                date: input.date,
                total: input.valor,
                cota: input.cota
            };

            var storage = JSON.parse(localStorage.getItem("historico"));
            if (storage === null) {
                storage = {
                    itens: []
                };
                storage.itens.push(item);
            } else {
                storage.itens.push(item);
            }
            localStorage.setItem("historico", JSON.stringify(storage));

            

            // mostra valores consultados
            var newItem = appCtrl.addVeic(input.type, input.cota, input.valor);

            UICtrl.adicionaLista(newItem, input.id, input.valor, input.cota);

            UICtrl.limparCampos();
            
            getId();
            setupEvtList();

        }

    };

    var ctrlDeleteItem = function (event) {
        var buscarID, splidID, ID;
        buscarID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        
        if(buscarID){
            splidID = buscarID.split('-');
            ID = parseInt(splidID[0]);

            getId();
        }

        UICtrl.deletaLista(buscarID);


    };
    
    return {
        init: function () {
            getStorageItems();
            setupEvtList();
            getId();
        }
    };

})(appControlador, UIControlador);

controlador.init();