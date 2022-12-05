// ==UserScript==
// @name         Tiempos Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Permite montos negativos, inserta terminaciones y pares.
// @author       Dilbert Ramírez
// @match        https://timesdashboard.com/Herradura/apuestasorteo*
// @include https://timesdashboard.com/Herradura/apuestasorteo*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @updateURL    https://github.com/DilbertRV/dashboardV2/raw/main/dashboradV2.user.js
// @downloadURL  https://github.com/DilbertRV/dashboardV2/raw/main/dashboradV2.user.js
// @grant        none
// ==/UserScript==
(function () {
    //var link = document.createElement('link');
    //link.setAttribute('rel', 'stylesheet');
    //link.setAttribute('type', 'text/css');
    //link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Dongle&family=Nunito:wght@500&display=swap');
    //document.head.appendChild(link);
    //var bodyStyle = document.body;
    //bodyStyle.style.fontFamily = "Nunito";
    

    var ulList = document.getElementsByClassName("nav nav-tabs");
    var ulList2 = document.getElementsByClassName("nav nav-tabs")[0];
    var div = document.createElement("div");
    div.setAttribute("id", "numbers");
    div.className = "numbers";
    div.style = "padding: 0px;";
    ulList2.appendChild(div);
    var p = document.createElement("p");
    p.innerHTML = "Refuerzos";
    p.style = "margin-left: 10px; margin-top: 10px; color: blue;";
    div.appendChild(p);
    var divContainerNumeros = document.createElement("div");
    var listaDeNavLinks = [
        "LA SUERTE",
        "LOTERÍA",
        "FLORIDA",
        "PAPA",
        "NEW YORK",
        "LOTEKA",
    ];

    function listaDeSorteos() {
        setTimeout(function () {
            var result = document.querySelectorAll(
                "ul> div > div > ul > li > a.nav-link"
            );
            for (var i = 0; i < result.length; i++) {
                if(result[i].innerHTML.includes("NICA")){
                    result[i].style = "color: blue;";
                } else if(result[i].innerHTML.includes("HONDURAS")){
                    result[i].style = "color: #168dee;";
                }
                if (listaDeNavLinks.some((v) => result[i].innerHTML.includes(v))) {
                    console.log("removing " + result[i].innerHTML);
                    result[i].remove();
                }
                result[i].addEventListener("click", function () {
                    if (document.contains(document.getElementById("containerNumeros"))) {
                        actualizarRefuerzos();
                    } else {
                        generarListaRefuerzos();
                    }
                });
            }
        }, 1000);
    }
    listaDeSorteos();

    function generarListaRefuerzos() {
        var divContainerNumeros = document.createElement("div");
        divContainerNumeros.setAttribute("id", "containerNumeros");
        divContainerNumeros.className = "container-numeros";
        divContainerNumeros.style =
            "display: grid; grid-template-columns: 120px 120px; gap: 10px; padding-top: 10px;";
        div.appendChild(divContainerNumeros);
        actualizarRefuerzos();
    }
    function actualizarRefuerzos() {
        setTimeout(function () {
            var totalLista = document.getElementById("spTotal");
            var totalListaFiltrado = totalLista.textContent.replace("Total:  ¢", "");
            totalListaFiltrado = totalListaFiltrado.replace(/\D/g, "");
            totalListaFiltrado = parseInt(totalListaFiltrado);
            console.log(totalListaFiltrado);
            var montoDelRefuerzo;
            if (totalListaFiltrado > 100000) {
                montoDelRefuerzo = 3000;
            } else if (totalListaFiltrado > 75000) {
                montoDelRefuerzo = 2500;
            } else if (totalListaFiltrado > 60000 && totalListaFiltrado <= 75000) {
                montoDelRefuerzo = 2000;
            } else if (totalListaFiltrado < 40000) {
                montoDelRefuerzo = 1500;
            }
            var table = document.getElementsByClassName("table table-xs")[0];
            var tdChildNodes = [];
            var td = table.children[1].children;
            var numerosAltos = [];
            for (var i = 0; i < td.length; i++) {
                tdChildNodes.push(td[i].childNodes);
            }
            for (var j = 0; j < tdChildNodes.length; j++) {
                for (var k = 0; k < tdChildNodes[j].length; k++) {
                    var montoTotal = tdChildNodes[j][k];
                    if (montoTotal.textContent.includes("¢")) {
                        var monto = [];
                        monto = montoTotal.textContent.replace("¢", "");
                        monto = monto.replace(/\D/g, "");
                        console.log(parseInt(monto));
                        if (monto >= parseInt(montoDelRefuerzo)) {
                            var numeroAlto = tdChildNodes[j][k - 2].innerHTML;
                            numeroAlto = numeroAlto.replace(/\D/g, "");
                            numerosAltos.push(
                                numeroAlto + " - " + tdChildNodes[j][k].innerHTML + "🔴"
                            );
                        }
                    }
                }
            }
            imprimirRefuerzosEnPantalla();
            function imprimirRefuerzosEnPantalla() {
                //delete everuthing inside containerNumeros div and then print the new numbers
                var containerNumeros = document.getElementById("containerNumeros");
                while (containerNumeros.firstChild) {
                    containerNumeros.removeChild(containerNumeros.firstChild);
                }
                for (var i = 0; i < numerosAltos.length; i++) {
                    var label = document.createElement("label");
                    label.setAttribute("id", "label" + i);
                    label.className = "label";
                    label.style =
                        "display:flex; justify-content: center; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 4px; padding: 5px; margin: 5px; font-size: 12px; font-weight: bold; color: #000;";
                    label.innerHTML = numerosAltos[i];

                    for (var w = 0; w < numerosAltos.length; w++) {
                        if (
                            document.contains(document.getElementById("containerNumeros"))
                        ) {
                            containerNumeros.appendChild(label);
                        }
                    }
                }
            }
        }, 1000);
    }
    function appendButtons() {
        var inputNumero = document.getElementById("txtNumeroApuesta");
        var script = document.getElementById("txtMontoApuesta");
        var buttonImprimir = document.querySelectorAll("button")[8];
        script.onkeydown = function () {
            return null;
        };
        var divSorteo = document.getElementById("divSorteo");
        var divCard = document.querySelectorAll('div [class="card-body"]');
        var divCol = document.querySelectorAll('div [class="col-md-8"]');

        var button = document.createElement("button");
        button.innerHTML = "Quitar límite";
        button.className = "btn btn-primary btn-min-width mr-1 mb-1";
        button.style = "margin: 5px;";
        button.onclick = function () {
            var script = document.getElementById("txtMontoApuesta");
            script.onkeydown = null;
        };
        //divCard[0].appendChild(button);
        divCol[0].style = "margin-bottom: -36px;";
         var pares = document.createElement("p");
        pares.innerHTML = "Pares";
        pares.style = "margin-top: 10px;";
        divCard[0].appendChild(pares);

        var btnPares = document.createElement("button");
        btnPares.innerHTML = "Pares";
        btnPares.className = "btn btn-info";
        btnPares.style =
            "margin-top: -18px; width: auto; height: 28px; text-align: center; line-height: 0px; ";
        btnPares.onclick = function () {
            inputNumero.value += "00+11+22+33+44+55+66+77+88+99+";
            focusInput(inputNumero);
        };
        divCard[0].appendChild(btnPares);
        var terminaciones = document.createElement("p");
        terminaciones.innerHTML = "Terminaciones";
        terminaciones.setAttribute("id", "term");
        divCard[0].appendChild(terminaciones);
        for (var i = 0; i < 10; i++) {
            var btnTerminaciones = document.createElement("button");
            btnTerminaciones.innerHTML = i;
            btnTerminaciones.className = "btn btn-info";
            btnTerminaciones.style =
                "margin-top: -18px; width: auto; height: 12px; text-align: center; line-height: 0px; ";
            btnTerminaciones.onclick = function (e) {
                if (e.target.innerHTML == "0") {
                    inputNumero.value += "00+10+20+30+40+50+60+70+80+90+";
                } else if (e.target.innerHTML == "1") {
                    inputNumero.value += "01+11+21+31+41+51+61+71+81+91+";
                } else if (e.target.innerHTML == "2") {
                    inputNumero.value += "02+12+22+32+42+52+62+72+82+92+";
                } else if (e.target.innerHTML == "3") {
                    inputNumero.value += "03+13+23+33+43+53+63+73+83+93+";
                } else if (e.target.innerHTML == "4") {
                    inputNumero.value += "04+14+24+34+44+54+64+74+84+94+";
                } else if (e.target.innerHTML == "5") {
                    inputNumero.value += "05+15+25+35+45+55+65+75+85+95+";
                } else if (e.target.innerHTML == "6") {
                    inputNumero.value += "06+16+26+36+46+56+66+76+86+96+";
                } else if (e.target.innerHTML == "7") {
                    inputNumero.value += "07+17+27+37+47+57+67+77+87+97+";
                } else if (e.target.innerHTML == "8") {
                    inputNumero.value += "08+18+28+38+48+58+68+78+88+98+";
                } else if (e.target.innerHTML == "9") {
                    inputNumero.value += "09+19+29+39+49+59+69+79+89+99+";
                }
                focusInput(inputNumero);
            };
            divCard[0].appendChild(btnTerminaciones);
        }
       
        var decenas = document.createElement("p");
        decenas.innerHTML = "Decenas";
        decenas.setAttribute("id", "dec");
        divCard[0].appendChild(decenas);
        for (var j = 0; j < 10; j++) {
            var btnDecenas = document.createElement("button");
            btnDecenas.innerHTML = j + "0";
            btnDecenas.className = "btn btn-info";
            btnDecenas.style =
                "margin-top: -18px; width: auto; height: 12px; text-align: center; line-height: 0px; ";
            btnDecenas.onclick = function (e) {
                if (e.target.innerHTML == "00") {
                    inputNumero.value += "00+01+02+03+04+05+06+07+08+09+";
                } else if (e.target.innerHTML == "10") {
                    inputNumero.value += "10+11+12+13+14+15+16+17+18+19+";
                } else if (e.target.innerHTML == "20") {
                    inputNumero.value += "20+21+22+23+24+25+26+27+28+29+";
                } else if (e.target.innerHTML == "30") {
                    inputNumero.value += "30+31+32+33+34+35+36+37+38+39+";
                } else if (e.target.innerHTML == "40") {
                    inputNumero.value += "40+41+42+43+44+45+46+47+48+49+";
                } else if (e.target.innerHTML == "50") {
                    inputNumero.value += "50+51+52+53+54+55+56+57+58+59+";
                } else if (e.target.innerHTML == "60") {
                    inputNumero.value += "60+61+62+63+64+65+66+67+68+69+";
                } else if (e.target.innerHTML == "70") {
                    inputNumero.value += "70+71+72+73+74+75+76+77+78+79+";
                } else if (e.target.innerHTML == "80") {
                    inputNumero.value += "80+81+82+83+84+85+86+87+88+89+";
                } else if (e.target.innerHTML == "90") {
                    inputNumero.value += "90+91+92+93+94+95+96+97+98+99+";
                }
                focusInput(inputNumero);
            };
            divCard[0].appendChild(btnDecenas);
        }
    }
    function focusInput(input) {
        input.focus();
        var val = input.value;
        input.value = "";
        input.value = val;
    }
    ulList[0].onclick = function () {
        setTimeout(function () {
            var inputNumero = document.getElementById("txtNumeroApuesta");
            var termAlreadyExist = document.getElementById("term");

            //save the numbers in a array and print in a div
            if (termAlreadyExist === null) {
                appendButtons();
            }
        }, 1000);
    };
    //Observer
    (function (doc, found) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var termAlreadyExist = doc.querySelector("#term");
                if (found && !termAlreadyExist) {
                    appendButtons();
                    found = false;
                }
                if (termAlreadyExist) {
                    found = true;
                }
            });
        });
        observer.observe(doc, { childList: true, subtree: true });
    })(document, false);
})();
