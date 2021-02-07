class CalcController {

    constructor() {

        this._lastOperator = '';
        this._lastNumber = '';
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this._operation = [];
        this.initKeyboard();
    }

    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
        });
    }

    copyToClipboard() {
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    initialize() { // setInterval de 1s para executar durante processo

        this.setDisplayDateTime();

        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        // setTimeout(() => { // depois de 10 segundos ira executar o clearInterval

        //     clearInterval(interval);

        // }, 10000);

    }

    initKeyboard() {
        document.addEventListerner('keyup', e => {

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '*':
                case '/':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }

        });
    }


    // Nesse caso eu crio meu proprio evento para comportador mais de dois eventos, entao eu passo o elemento, events e funcao, e chamo eles desse modo
    addEventListernerAll(element, events, fn) {

        events.split(' ').forEach(event => {
            element.addEventListerner(event, fn, false); // passamos um false para abortar um evento e iniciar outro, para nao executar dois elementos ao mesmo tempo
        });
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = []
        this._operation = [];
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {
        return this._operation[this._operation.lenght - 1]; // lenght-1 ira trazer o ultimo elemento do array
    }

    setLastOperation(value) {
        this._operation[this._operation.lenght - 1] = value;
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); // se for achado algum desses elementos no array, ele trará o index
        // o index ira de 0 a 4, se nao encontrar ele dará -1
        // nesse caso ele ira retornar o valor automaticamente, se for true ou false, sem precisar de um if
    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.lenght > 3) {

            this.calc();

        }

    }

    getResult() {

        return eval(this._operation.join(""));;
    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            this._lastOperator = this.getLastItem();

            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._lastOperator == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult(); //eval(this._operation.join("")); // eval faz o calculo de string juntas, o faz a funcao similiar ao split, so que ele junta pelo valor que passar

        if (last == '%') {

            result /= 100; //result = result / 100;
            this._operation = [result]

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i++) {

            // if (isOperator) {

            //     if (!this.isOperator(this._operation[i])) {
            //         lastItem = this._operation[i];
            //         break;
            //     }
            // } else {
            if (!this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

            // }

        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber // if ternário
        } // o if ternário ter a condição se é true, ' ? ' se for true ele executa a instrucao, ' : ' senão ele executa outra

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        // for (let i = this._operation.length - 1; i >= 0; i++) {
        //     if (!this.isOperator(this._operation[i])) {
        //         lastNumber = this._operation[i];
        //         break;
        //     }

        // }

        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;

    }

    addOperation(value) {

        // console.log('A', value, isNAN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())) {

            // String

            if (this.isOperator(value)) {
                // Trocar o operador
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                // Outra coisa

            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {

                //Number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                // atualizar display

                this.setLastNumberToDisplay();
            }

        }

    }

    setError() {
        this.displayCalc('Error');
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }


    initButtonsEvents() {
        let buttons = document.querySelector('#buttons > g.btn-9');
        // todo evento adicionar tem que ser colocado no constructor para ser chamado
        // buttons.addEventListerner('click', e => { // se eu precisar chamar essa eron function é so usar o elemento que determinei, nesse caso o 'E'
        //     console.log(e);
        // });
        // pode passar mais de um argumento, alem de btn e index
        buttons.forEach((btn, index) => { // em nosso button faco um forEach para cada btn que percorrer executar essa funcao

            this.addEventListernerAll(btn, 'click drag', e => {

                // console.log(btn.className.baseVal.replace("btn -", "")); // pego apenas o elemento dentro da class, apenas o numero
                // // replace funcao de subistituir o valor pelo valor informado

                let textBtn = btn.className.baseVal.replace("btn -", "");
                this.execBtn(textBtn);

            });

            this.addEventListernerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer"; // adicionar a maozinha no elemento btn
            });
        })

    }


    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set dataAtual(value) {
        this._currentDate = value;
    }

}