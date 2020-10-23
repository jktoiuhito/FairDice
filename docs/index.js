(()=>{"use strict";class t{constructor(t,e){if(void 0!==e&&"string"!=typeof e)throw new Error("Name must be of type string or undefined");if("string"==typeof e){if(""===e)throw new Error("Name cannot be empty");if(""===e.trim())throw new Error("Name cannot consist only of whitespace")}this._value=t,this._name=null==e?void 0:e.trim()}get value(){return this._value}}class e extends t{constructor(t,e){if(super(t,e),"function"!=typeof t)throw new Error("Value must be of type function");Object.freeze(this)}}class n extends t{constructor(t,e){if(super(t,e),this.isEqual=t=>{if("boolean"!=typeof t)throw new Error("Argument must be of type boolean");if(this._value!==t)throw new Error(void 0!==this._name?`'${this._name}' is not '${t.toString()}'`:`boolean is not '${t.toString()}'`);return this},"boolean"!=typeof t)throw new Error("Value must be of type boolean");Object.freeze(this)}get isTrue(){if(!this._value)throw new Error(void 0!==this._name?`'${this._name}' is not true`:"boolean is not true");return this}get isFalse(){if(this._value)throw new Error(void 0!==this._name?`'${this._name}' is not false`:"boolean is not false");return this}}class i extends t{constructor(t,e){if(super(t,e),this.isGreaterThan=t=>{if("number"!=typeof t)throw new Error("Argument must be of type number");if(!(t<this._value))throw new Error(void 0!==this._name?`'${this._name}' is not greater than '${t.toString()}'`:`number is not greater than '${t.toString()}'`);return this},this.isLessThan=t=>{if("number"!=typeof t)throw new Error("Argument must be of type number");if(!(this._value<t))throw new Error(void 0!==this._name?`'${this._name}' is not less than '${t.toString()}'`:`number is not less than '${t.toString()}'`);return this},"number"!=typeof t)throw new Error("Value must be of type number");Object.freeze(this)}get isSafeInteger(){if(!Number.isSafeInteger(this._value))throw new Error(void 0!==this._name?`'${this._name}' is not a safe integer`:"number is not a safe integer");return this}get isNaN(){if(!Number.isNaN(this._value))throw new Error(void 0!==this._name?`'${this._name}' is not NaN`:"number is not NaN");return this}get isNotNaN(){if(Number.isNaN(this._value))throw new Error(void 0!==this._name?`'${this._name}' is NaN`:"number is NaN");return this}}class r extends t{constructor(t,e){if(super(t,e),this.isMatch=t=>{if(!("object"==typeof t&&t instanceof RegExp))throw new Error("Argument must be of type RegExp");if(!t.test(this._value))throw new Error(void 0!==this._name?`'${this._name}' does not match the regular expression ${t.toString()}`:"string does not match the regular expression "+t.toString());return this},this.isNotMatch=t=>{if(!("object"==typeof t&&t instanceof RegExp))throw new Error("Argument must be of type RegExp");if(t.test(this._value))throw new Error(void 0!==this._name?`'${this._name}' matches the regular expression ${t.toString()}`:"string matches the regular expression "+t.toString());return this},"string"!=typeof t)throw new Error("Value must be of type string");Object.freeze(this)}get isNotEmpty(){if(""===this._value)throw new Error(void 0!==this._name?`String '${this._name}' is empty`:"String is empty");return this}get isEmpty(){if(""!==this._value)throw new Error(void 0!==this._name?`String '${this._name}' is not empty`:"String is not empty");return this}get isNotWhitespace(){if(this._value.length>0&&""===this._value.trim())throw new Error(void 0!==this._name?`String '${this._name}' consists only of whitespace`:"String consists only of whitespace");return this}}class s extends t{constructor(t,e){if(super(t,e),"symbol"!=typeof t)throw new Error("Value must be of type symbol");Object.freeze(this)}}class o extends t{constructor(t,e){if(super(t,e),this.isInstanceOf=t=>{if("function"!=typeof t)throw new Error("Type must be of type function");if(void 0===t.prototype)throw new Error("Type must have a defined prototype");if(!(this._value instanceof t))throw new Error(`Object is not an instance of '${t.name}'`);return this},this.is=t=>{if("object"!=typeof t)throw new Error("Argument must be of type object");if(null===t)throw new Error("Argument cannot be null");if(this._value!==t)throw new Error(void 0!==this._name?`'${this._name}' is not referentially equal to the given object`:"object is not referentially equal to the given object");return this},this.isNot=t=>{if("object"!=typeof t)throw new Error("Argument must be of type object");if(null===t)throw new Error("Argument cannot be null");if(this._value===t)throw new Error(void 0!==this._name?`'${this._name}' is referentially equal to the given object`:"object is referentially equal to the given object");return this},this.isMatch=t=>{if("function"!=typeof t)throw new Error("Predicate must be of type function");if(1!==t.length)throw new Error("Predicate must expect exactly one parameter");const e=t(this._value);if("boolean"!=typeof e)throw new Error("Predicate must return a value of type boolean");if(!e)throw new Error(void 0!==this._name?`'${this._name}' does not match the predicate`:"object does not match the predicate");return this},"object"!=typeof t)throw new Error("Value must be of type object");if(null===t)throw new Error("Value cannot be null");Object.freeze(this)}}class a extends t{constructor(t,e){if(super(t,e),"object"!=typeof t)throw new Error("Value must be of type object");Object.freeze(this)}get isNull(){if(null!==this._value)throw new Error(void 0!==this._name?`'${this._name}' is not null`:"Value is not null");return this}get isNotNull(){if(null===this._value)throw new Error(void 0!==this._name?`'${this._name}' is null`:"Value is null");return new o(this._value,this._name)}}class h extends t{constructor(t,e){if(super(t,e),this.isGreaterThan=t=>{if("bigint"!=typeof t)throw new Error("Argument must be of type bigint");if(!(t<this._value))throw new Error(void 0!==this._name?`'${this._name}' is not greater than '${t.toString()}'`:`bigint is not greater than '${t.toString()}'`);return this},this.isLessThan=t=>{if("bigint"!=typeof t)throw new Error("Argument must be of type bigint");if(!(this._value<t))throw new Error(void 0!==this._name?`'${this._name}' is not less than '${t.toString()}'`:`bigint is not less than '${t.toString()}'`);return this},"bigint"!=typeof t)throw new Error("Value must be of type bigint");Object.freeze(this)}}class u extends t{constructor(t,e){super(t,e),Object.freeze(this)}get isBigint(){if("bigint"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not a bigint`:"Value is not a bigint");return new h(this._value,this._name)}get isBoolean(){if("boolean"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not a boolean`:"Value is not a boolean");return new n(this._value,this._name)}get isFunction(){if("function"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not a function`:"Value is not a function");return new e(this._value,this._name)}get isNumber(){if("number"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not a number`:"Value is not a number");return new i(this._value,this._name)}get isObject(){if("object"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not an object`:"Value is not an object");return new a(this._value,this._name)}get isString(){if("string"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not a string`:"Value is not a string");return new r(this._value,this._name)}get isSymbol(){if("symbol"!=typeof this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not a symbol`:"Value is not a symbol");return new s(this._value,this._name)}get isUndefined(){if(void 0!==this._value)throw new Error(void 0!==this._name?`Value of '${this._name}' is not undefined`:"Value is not undefined");return this}}const l=(t,e)=>new u(t,e);class m{constructor(t,e,n){this.Rolls=l(t).isObject.isNotNull.isInstanceOf(Array).value,this.Previous=e,this.Next=n}}class c{constructor(t,e){if(l(t).isNumber.isNotNaN.isSafeInteger.value<1)throw new Error("'dice' cannot be under one");if(l(e).isNumber.isNotNaN.isSafeInteger.value<1)throw new Error("'value' cannot be under one");if(e>t)throw new Error("'value' cannot be greater than 'dice'");this.Dice=t,this.Value=e,Object.freeze(this)}}class f{constructor(){this.onCurrentRollsChange=t=>{this.Listeners.push(l(t).isFunction.value)},this.Roll=t=>{this.CurrentRolls.Rolls.push(new c(t,1)),this.Changed(this.CurrentRolls)},this.Reset=()=>{const t=this.CurrentRolls,e=new m([]);t.Next=e,e.Previous=t,Object.freeze(t),this.History.push(e),this.CurrentRolls=e,this.Changed(this.CurrentRolls)},this.Changed=t=>{this.Listeners.forEach((e=>e(t)))},this.History=[],this.Listeners=[],this.CurrentRolls=new m([]),this.History.push(this.CurrentRolls)}}class d{constructor(t){this.DisplayCurrentRolls=t=>{for(this.CurrentRolls=t;null!==this.ResultsContainer.firstChild;)this.ResultsContainer.removeChild(this.ResultsContainer.firstChild);t.Rolls.forEach((t=>{const e=document.createElement("div");e.className="card m-1",e.style.width="4em",e.style.height="4em";const n=document.createElement("h5");n.className="badge text-muted",n.appendChild(document.createTextNode("d"+t.Dice.toString())),e.appendChild(n);const i=document.createElement("span");i.appendChild(document.createTextNode(t.Value.toString())),e.appendChild(i),this.ResultsContainer.appendChild(e)})),this.NewRollButton.disabled=t.Rolls.length<=0,this.PreviousButton.disabled=void 0===t.Previous,this.NextButton.disabled=void 0===t.Next},this.GetElementById=t=>l(document.getElementById(t)).isObject.isNotNull.isInstanceOf(HTMLElement).value,this.DiceContainer=this.GetElementById("dice"),this.ResultsContainer=this.GetElementById("results"),this.ControlsContainer=this.GetElementById("controls"),this.BenchmarkButton=this.GetElementById("button-benchmark"),this.PreviousButton=this.GetElementById("button-previous"),this.NextButton=this.GetElementById("button-next"),this.NewRollButton=this.GetElementById("button-new"),this.DiceContainer.hidden=!1,this.ResultsContainer.hidden=!1,this.ControlsContainer.hidden=!1,this.BenchmarkButton.hidden=!1,t.onCurrentRollsChange(this.DisplayCurrentRolls),d.Dice.forEach((e=>{const n=document.createElement("button");n.type="button",n.className="btn btn-primary m-2",n.style.width="4em";const i=document.createElement("p");i.className="m-0 p-0",i.append(document.createTextNode("D"+e.toString())),n.appendChild(i);const r=document.createElement("span");r.className="m-0 p-0 badge",r.append(document.createTextNode("0")),n.appendChild(r),n.addEventListener("click",(()=>{t.Roll(e)})),this.DiceContainer.appendChild(n)})),this.PreviousButton.addEventListener("click",(()=>{this.DisplayCurrentRolls(this.CurrentRolls.Previous)})),this.NextButton.addEventListener("click",(()=>{this.DisplayCurrentRolls(this.CurrentRolls.Next)})),this.NewRollButton.addEventListener("click",(()=>{t.Reset()})),this.BenchmarkButton.addEventListener("click",(()=>{throw new Error("not implemented")})),this.CurrentRolls=new m([]),this.DisplayCurrentRolls(this.CurrentRolls)}}d.Dice=[4,6,8,10,12,20,100],window.addEventListener("load",(()=>{new d(new f)}))})();