import { maxDecimals, cambiarColor, respetarLimites } from "./utils.js";
import { generateCorrelatedBernoulli, computeJointBernoulliProbabilities } from "./distribuciones.js";
import * as fusionadores from "./fusionadores.js";


const m1AccPositiveElement = document.getElementById("m1-acc-positive");
const m1AccNegativeElement = document.getElementById("m1-acc-negative");

const m2AccPositiveElement = document.getElementById("m2-acc-positive");
const m2AccNegativeElement = document.getElementById("m2-acc-negative");

const tipoFusionador = document.getElementById("tipo");

const correlacionPositiveElement = document.getElementById("correlacion-positive");
const correlacionNegativeElement = document.getElementById("correlacion-negative");

const costoPositiveElement = document.getElementById("costo-positive");
const costoNegativeElement = document.getElementById("costo-negative");

const cantidadPositiveTestM1Element = document.getElementById("cantidad-positive-test-m1");
const cantidadNegativeTestM1Element = document.getElementById("cantidad-negative-test-m1");

const cantidadPositiveTestM2Element = document.getElementById("cantidad-positive-test-m2");
const cantidadNegativeTestM2Element = document.getElementById("cantidad-negative-test-m2");

const m1TPelement = document.getElementById("m1-tp");
const m1TNelement = document.getElementById("m1-tn");
const m1FNelement = document.getElementById("m1-fn");
const m1FPelement = document.getElementById("m1-fp");

const sumaTPelement = document.getElementById("suma-tp");
const sumaTNelement = document.getElementById("suma-tn");
const sumaFNelement = document.getElementById("suma-fn");
const sumaFPelement = document.getElementById("suma-fp");

const restaTPelement = document.getElementById("resta-tp");
const restaTNelement = document.getElementById("resta-tn");
const restaFNelement = document.getElementById("resta-fn");
const restaFPelement = document.getElementById("resta-fp");

const m2TPelement = document.getElementById("m2-tp");
const m2TNelement = document.getElementById("m2-tn");
const m2FNelement = document.getElementById("m2-fn");
const m2FPelement = document.getElementById("m2-fp");

const peorCasoSistemaElement = document.getElementById("peor-caso-sistema");
const evalSistemaElement = document.getElementById("eval-sistema");
const sumaEvalModelo2Element = document.getElementById("suma-eval-modelo2");
const restaEvalModelo2Element = document.getElementById("resta-eval-modelo2");

const calculateCostBtnElement = document.getElementById("calculate-cost-btn");
const estimateEvaluationBtnElement = document.getElementById("estimate-evaluation-btn");
const generateInstancesBtnElement = document.getElementById("generate-instances-btn");
const testCostBtnElement = document.getElementById("test-cost-btn");

const backgroundColorElement = document.getElementById("page-background-color");
const containerColorElement = document.getElementById("container-background-color");



export function eventListeners(){
    calculateCostBtnElement.addEventListener('click', calcularCostos);
    testCostBtnElement.addEventListener('click', testearCostos);
    estimateEvaluationBtnElement.addEventListener('click', estimarEvaluacion);
    generateInstancesBtnElement.addEventListener('click', generarInstancias);

    backgroundColorElement.addEventListener('change', cambiarColor);
    containerColorElement.addEventListener('change', cambiarColor);


    m1AccPositiveElement.addEventListener('change', respetarLimites);
    m1AccNegativeElement.addEventListener('change', respetarLimites);
    m2AccPositiveElement.addEventListener('change', respetarLimites);
    m2AccNegativeElement.addEventListener('change', respetarLimites);
    correlacionPositiveElement.addEventListener('change', respetarLimites);
    correlacionNegativeElement.addEventListener('change', respetarLimites);

    respetarLimites();
}




function calcularCostos(){

    // probabilidad de resultado del sistema cuando el modelo 2 realiza cierta prediccion

    let m1AccPositive = parseFloat(m1AccPositiveElement.value);
    let m1AccNegative = parseFloat(m1AccNegativeElement.value);

    let m2AccPositive = parseFloat(m2AccPositiveElement.value);
    let m2AccNegative = parseFloat(m2AccNegativeElement.value);

    let correlacionPositive = parseFloat(correlacionPositiveElement.value);
    let correlacionNegative = parseFloat(correlacionNegativeElement.value);

    let cantidadPositive = parseFloat(cantidadPositiveTestM1Element.value);
    let cantidadNegative = parseFloat(cantidadNegativeTestM1Element.value);


    let probabilidadesPositive = computeJointBernoulliProbabilities(m1AccPositive, m2AccPositive, correlacionPositive);
    let probabilidadesNegative = computeJointBernoulliProbabilities(m1AccNegative, m2AccNegative, correlacionNegative);


    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;



    if (typeof(fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Promedio"]) === "function") {
        [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP] = 
            fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Promedio"](probabilidadesPositive[2]+probabilidadesPositive[3], probabilidadesNegative[2]+probabilidadesNegative[3]);
    } else {
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }


    // Instancias Modelo 1

    m1TPelement.value = maxDecimals(m1AccPositive * cantidadPositive, 2);
    m1TNelement.value = maxDecimals(m1AccNegative * cantidadNegative, 2);
    m1FNelement.value = maxDecimals((1 - m1AccPositive) * cantidadPositive, 2);
    m1FPelement.value = maxDecimals((1 - m1AccNegative) * cantidadNegative, 2);


    // Costos para el modelo 2

    sumaTPelement.value = maxDecimals(probFNcuandoP * costoPositiveElement.value, 6);
    sumaTNelement.value = maxDecimals(probFPcuandoN * costoNegativeElement.value, 6);
    sumaFNelement.value = maxDecimals(probFNcuandoN * costoPositiveElement.value, 6);
    sumaFPelement.value = maxDecimals(probFPcuandoP * costoNegativeElement.value, 6);

    restaTPelement.value = maxDecimals(sumaTPelement.value - sumaTPelement.value, 6);
    restaTNelement.value = maxDecimals(sumaTNelement.value - sumaTNelement.value, 6);
    restaFNelement.value = maxDecimals(sumaFNelement.value - sumaTPelement.value, 6);
    restaFPelement.value = maxDecimals(sumaFPelement.value - sumaTNelement.value, 6);
}




function testearCostos(){

    // probabilidad de resultado del sistema cuando el modelo 2 realiza cierta prediccion

    let m1AccPositive = parseFloat(m1AccPositiveElement.value);
    let m1AccNegative = parseFloat(m1AccNegativeElement.value);

    let m2AccPositive = parseFloat(m2AccPositiveElement.value);
    let m2AccNegative = parseFloat(m2AccNegativeElement.value);

    let correlacionPositive = parseFloat(correlacionPositiveElement.value);
    let correlacionNegative = parseFloat(correlacionNegativeElement.value);

    let cantidadPositive = parseFloat(cantidadPositiveTestM1Element.value);
    let cantidadNegative = parseFloat(cantidadNegativeTestM1Element.value);


    let instanciasPositive = generateCorrelatedBernoulli(m1AccPositive, m2AccPositive, correlacionPositive, cantidadPositive);
    let instanciasNegative = generateCorrelatedBernoulli(m1AccNegative, m2AccNegative, correlacionNegative, cantidadNegative);


    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;


    if (typeof(fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Instancias"]) === "function") {
        [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP] = 
            fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Instancias"](instanciasPositive, instanciasNegative);
    } else {
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }


    // Instancias Modelo 1

    m1TPelement.value = maxDecimals(instanciasPositive.filter((instancia) => instancia[0] == 1).length, 0);
    m1TNelement.value = maxDecimals(instanciasNegative.filter((instancia) => instancia[0] == 1).length, 0);
    m1FNelement.value = maxDecimals(instanciasPositive.filter((instancia) => instancia[0] == 0).length, 0);
    m1FPelement.value = maxDecimals(instanciasNegative.filter((instancia) => instancia[0] == 0).length, 0);


    // Costos para el modelo 2

    sumaTPelement.value = maxDecimals(probFNcuandoP * costoPositiveElement.value, 6);
    sumaTNelement.value = maxDecimals(probFPcuandoN * costoNegativeElement.value, 6);
    sumaFNelement.value = maxDecimals(probFNcuandoN * costoPositiveElement.value, 6);
    sumaFPelement.value = maxDecimals(probFPcuandoP * costoNegativeElement.value, 6);

    restaTPelement.value = maxDecimals(sumaTPelement.value - sumaTPelement.value, 6);
    restaTNelement.value = maxDecimals(sumaTNelement.value - sumaTNelement.value, 6);
    restaFNelement.value = maxDecimals(sumaFNelement.value - sumaTPelement.value, 6);
    restaFPelement.value = maxDecimals(sumaFPelement.value - sumaTNelement.value, 6);
}




function estimarEvaluacion(){

    let sumaTP = parseFloat(sumaTPelement.value);
    let sumaTN = parseFloat(sumaTNelement.value);
    let sumaFN = parseFloat(sumaFNelement.value);
    let sumaFP = parseFloat(sumaFPelement.value);

    let restaTP = parseFloat(restaTPelement.value);
    let restaTN = parseFloat(restaTNelement.value);
    let restaFN = parseFloat(restaFNelement.value);
    let restaFP = parseFloat(restaFPelement.value);

    let costoPositive = parseFloat(costoPositiveElement.value);
    let costoNegative = parseFloat(costoNegativeElement.value);

    let m1AccPositive = parseFloat(m1AccPositiveElement.value);
    let m1AccNegative = parseFloat(m1AccNegativeElement.value);

    let m2AccPositive = parseFloat(m2AccPositiveElement.value);
    let m2AccNegative = parseFloat(m2AccNegativeElement.value);

    let correlacionPositive = parseFloat(correlacionPositiveElement.value);
    let correlacionNegative = parseFloat(correlacionNegativeElement.value);

    let cantidadPositive = parseFloat(cantidadPositiveTestM2Element.value);
    let cantidadNegative = parseFloat(cantidadNegativeTestM2Element.value);

    let m1AccPositiveMedicion = parseFloat(m1TPelement.value) / parseFloat(cantidadPositiveTestM1Element.value);
    let m1AccNegativeMedicion = parseFloat(m1TNelement.value) / parseFloat(cantidadNegativeTestM1Element.value);



    // Versión sin generar instancias calculando la probabilidad conjunta y multiplicando por la cantidad
    // La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente

    let probabilidadesPositive = computeJointBernoulliProbabilities(m1AccPositive, m2AccPositive, correlacionPositive);
    let probabilidadesNegative = computeJointBernoulliProbabilities(m1AccNegative, m2AccNegative, correlacionNegative);



    // Confusiones Modelo 2

    let cantidadModelo2TP = (probabilidadesPositive[1] + probabilidadesPositive[3]) * cantidadPositive;
    let cantidadModelo2TN = (probabilidadesNegative[1] + probabilidadesNegative[3]) * cantidadNegative;
    let cantidadModelo2FN = (probabilidadesPositive[0] + probabilidadesPositive[2]) * cantidadPositive;
    let cantidadModelo2FP = (probabilidadesNegative[0] + probabilidadesNegative[2]) * cantidadNegative;



    // Confusiones Sistema

    let probabilidadAciertoSistemaPositive;
    let probabilidadAciertoSistemaNegative;

    if (typeof(fusionadores[tipoFusionador.value+"FusionadorAciertoPromedio"]) === "function") {
        [probabilidadAciertoSistemaPositive, probabilidadAciertoSistemaNegative] = 
            fusionadores[tipoFusionador.value+"FusionadorAciertoPromedio"](probabilidadesPositive, probabilidadesNegative);
    } else {
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }

    let cantidadSistemaTP = probabilidadAciertoSistemaPositive * cantidadPositive;
    let cantidadSistemaTN = probabilidadAciertoSistemaNegative * cantidadNegative;
    let cantidadSistemaFN = (1 - probabilidadAciertoSistemaPositive) * cantidadPositive;
    let cantidadSistemaFP = (1 - probabilidadAciertoSistemaNegative) * cantidadNegative;



    // Evaluación del sistema

    evalSistemaElement.value = 
    maxDecimals(cantidadSistemaFN,2)+'*'+maxDecimals(costoPositive,2)+' + '+
    maxDecimals(cantidadSistemaFP,2)+'*'+maxDecimals(costoNegative,2)+'  =  '+
    maxDecimals(cantidadSistemaFN*costoPositive+
    cantidadSistemaFP*costoNegative,2);



    // Evaluación modelo 2

    sumaEvalModelo2Element.value = 
    maxDecimals(cantidadModelo2TP,2)+'*'+maxDecimals(sumaTP,2)+' + '+
    maxDecimals(cantidadModelo2TN,2)+'*'+maxDecimals(sumaTN,2)+' + '+
    maxDecimals(cantidadModelo2FN,2)+'*'+maxDecimals(sumaFN,2)+' + '+
    maxDecimals(cantidadModelo2FP,2)+'*'+maxDecimals(sumaFP,2)+'  =  '+
    maxDecimals(cantidadModelo2TP * sumaTP + 
    cantidadModelo2TN * sumaTN + 
    cantidadModelo2FN * sumaFN + 
    cantidadModelo2FP * sumaFP,2);

    restaEvalModelo2Element.value = 
    maxDecimals(cantidadModelo2TP,2)+'*'+maxDecimals(restaTP,2)+' + '+
    maxDecimals(cantidadModelo2TN,2)+'*'+maxDecimals(restaTN,2)+' + '+
    maxDecimals(cantidadModelo2FN,2)+'*'+maxDecimals(restaFN,2)+' + '+
    maxDecimals(cantidadModelo2FP,2)+'*'+maxDecimals(restaFP,2)+'  =  '+
    maxDecimals(cantidadModelo2TP * restaTP + 
    cantidadModelo2TN * restaTN + 
    cantidadModelo2FN * restaFN + 
    cantidadModelo2FP * restaFP,2);

    m2TPelement.value = maxDecimals(m2AccPositive * cantidadPositive, 2);
    m2TNelement.value = maxDecimals(m2AccNegative * cantidadNegative, 2);
    m2FNelement.value = maxDecimals((1 - m2AccPositive) * cantidadPositive, 2);
    m2FPelement.value = maxDecimals((1 - m2AccNegative) * cantidadNegative, 2);




    // Costo Peor Caso

    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;

    if (typeof(fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Promedio"]) === "function") {
        [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP] = 
            fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Promedio"](m1AccPositiveMedicion, m1AccNegativeMedicion);
    } else {
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }
    
    let peorCasoAciertosEnPositive = Math.min(cantidadModelo2TP, probFNcuandoP * cantidadPositive);
    let peorCasoAciertosEnNegative = Math.min(cantidadModelo2TN, probFPcuandoN * cantidadNegative);
    
    peorCasoSistemaElement.value = 
    '('+maxDecimals(peorCasoAciertosEnPositive,2)+'+'+
    maxDecimals(Math.min(probFNcuandoN * cantidadPositive - peorCasoAciertosEnPositive, cantidadModelo2FN),2)+
    ') * '+costoPositive+' + '+
    '('+maxDecimals(peorCasoAciertosEnNegative,2)+'+'+
    maxDecimals(Math.min(probFPcuandoP * cantidadNegative - peorCasoAciertosEnNegative, cantidadModelo2FP),2)+
    ') * '+costoNegative+' = '+
    maxDecimals((peorCasoAciertosEnPositive +
    Math.min(probFNcuandoN * cantidadPositive - peorCasoAciertosEnPositive, cantidadModelo2FN)) * 
    costoPositive + 
    (peorCasoAciertosEnNegative + 
    Math.min(probFPcuandoP * cantidadNegative - peorCasoAciertosEnNegative, cantidadModelo2FP)) * 
    costoNegative,2);
}   




function generarInstancias(){

    let sumaTP = parseFloat(sumaTPelement.value);
    let sumaTN = parseFloat(sumaTNelement.value);
    let sumaFN = parseFloat(sumaFNelement.value);
    let sumaFP = parseFloat(sumaFPelement.value);

    let restaTP = parseFloat(restaTPelement.value);
    let restaTN = parseFloat(restaTNelement.value);
    let restaFN = parseFloat(restaFNelement.value);
    let restaFP = parseFloat(restaFPelement.value);

    let costoPositive = parseFloat(costoPositiveElement.value);
    let costoNegative = parseFloat(costoNegativeElement.value);

    let m1AccPositive = parseFloat(m1AccPositiveElement.value);
    let m1AccNegative = parseFloat(m1AccNegativeElement.value);

    let m2AccPositive = parseFloat(m2AccPositiveElement.value);
    let m2AccNegative = parseFloat(m2AccNegativeElement.value);

    let correlacionPositive = correlacionPositiveElement.value;
    let correlacionNegative = correlacionNegativeElement.value;

    let cantidadPositive = parseFloat(cantidadPositiveTestM2Element.value);
    let cantidadNegative = parseFloat(cantidadNegativeTestM2Element.value);
    
    let m1AccPositiveMedicion = parseFloat(m1TPelement.value) / parseFloat(cantidadPositiveTestM1Element.value);
    let m1AccNegativeMedicion = parseFloat(m1TNelement.value) / parseFloat(cantidadNegativeTestM1Element.value);


    
    // Generar instancias
    // La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente

    let instanciasPositive = generateCorrelatedBernoulli(m1AccPositive, m2AccPositive, correlacionPositive, cantidadPositive);
    let instanciasNegative = generateCorrelatedBernoulli(m1AccNegative, m2AccNegative, correlacionNegative, cantidadNegative);

    // Calcular confusiónes Modelo 2

    let cantidadSistemaTP = 0;
    let cantidadSistemaTN = 0;
    let cantidadSistemaFN = 0;
    let cantidadSistemaFP = 0;

    let cantidadModelo2TP = 0;
    let cantidadModelo2TN = 0;
    let cantidadModelo2FN = 0;
    let cantidadModelo2FP = 0;

    for(const [predM1, predM2] of instanciasPositive){
        if(predM2 == 1){
            cantidadModelo2TP = cantidadModelo2TP + 1;
        }else{
            cantidadModelo2FN = cantidadModelo2FN + 1;
        }
    }

    for(const [predM1, predM2] of instanciasNegative){
        if(predM2 == 1){
            cantidadModelo2TN = cantidadModelo2TN + 1;
        }else{
            cantidadModelo2FP = cantidadModelo2FP + 1;
        }
    }



        // Calcular confusiónes Sistema

    let instanciasSistemaPositive;
    let instanciasSistemaNegative;

    if (typeof(fusionadores[tipoFusionador.value+"FusionadorAciertoInstancias"]) === "function") {
        [instanciasSistemaPositive, instanciasSistemaNegative] = 
            fusionadores[tipoFusionador.value+"FusionadorAciertoInstancias"](instanciasPositive, instanciasNegative);
    } else {
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }

    for(const instancia of instanciasSistemaPositive){
        if(instancia){
            cantidadSistemaTP = cantidadSistemaTP + 1;
        }else{
            cantidadSistemaFN = cantidadSistemaFN + 1;
        }
    }

    for(const instancia of instanciasSistemaNegative){
        if(instancia){
            cantidadSistemaFP = cantidadSistemaFP + 1;
        }else{
            cantidadSistemaTN = cantidadSistemaTN + 1;
        }
    }



    // Evaluación del sistema

    evalSistemaElement.value = 
    maxDecimals(cantidadSistemaFN,2)+'*'+maxDecimals(costoPositive,2)+' + '+
    maxDecimals(cantidadSistemaFP,2)+'*'+maxDecimals(costoNegative,2)+'  =  '+
    maxDecimals(cantidadSistemaFN*costoPositive+
    cantidadSistemaFP*costoNegative, 2);


    
    // Evaluación modelo 2

    sumaEvalModelo2Element.value = 
    maxDecimals(cantidadModelo2TP,2)+'*'+maxDecimals(sumaTP,2)+' + '+
    maxDecimals(cantidadModelo2TN,2)+'*'+maxDecimals(sumaTN,2)+' + '+
    maxDecimals(cantidadModelo2FN,2)+'*'+maxDecimals(sumaFN,2)+' + '+
    maxDecimals(cantidadModelo2FP,2)+'*'+maxDecimals(sumaFP,2)+'  =  '+
    maxDecimals(cantidadModelo2TP * sumaTP + 
    cantidadModelo2TN * sumaTN + 
    cantidadModelo2FN * sumaFN + 
    cantidadModelo2FP * sumaFP,2);

    restaEvalModelo2Element.value = 
    maxDecimals(cantidadModelo2TP,2)+'*'+maxDecimals(restaTP,2)+' + '+
    maxDecimals(cantidadModelo2TN,2)+'*'+maxDecimals(restaTN,2)+' + '+
    maxDecimals(cantidadModelo2FN,2)+'*'+maxDecimals(restaFN,2)+' + '+
    maxDecimals(cantidadModelo2FP,2)+'*'+maxDecimals(restaFP,2)+'  =  '+
    maxDecimals(cantidadModelo2TP * restaTP + 
    cantidadModelo2TN * restaTN + 
    cantidadModelo2FN * restaFN + 
    cantidadModelo2FP * restaFP,2);

    m2TPelement.value = maxDecimals(instanciasPositive.filter((instancia) => instancia[1] == 1).length, 0);
    m2TNelement.value = maxDecimals(instanciasNegative.filter((instancia) => instancia[1] == 1).length, 0);
    m2FNelement.value = maxDecimals(instanciasPositive.filter((instancia) => instancia[1] == 0).length, 0);
    m2FPelement.value = maxDecimals(instanciasNegative.filter((instancia) => instancia[1] == 0).length, 0);



    // Costo Peor Caso

    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;

    if (typeof(fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Promedio"]) === "function") {
        [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP] = 
            fusionadores[tipoFusionador.value+"FusionadorFalloIntervencionResultado2Promedio"](m1AccPositiveMedicion, m1AccNegativeMedicion);
    } else {
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }

    let peorCasoAciertosEnPositive = Math.min(cantidadModelo2TP, probFNcuandoP * cantidadPositive);
    let peorCasoAciertosEnNegative = Math.min(cantidadModelo2TN, probFPcuandoN * cantidadNegative);
    
    peorCasoSistemaElement.value = 
    '('+maxDecimals(peorCasoAciertosEnPositive,2)+'+'+
    maxDecimals(Math.min(probFNcuandoN * cantidadPositive - peorCasoAciertosEnPositive, cantidadModelo2FN),2)+
    ') * '+costoPositive+' + '+
    '('+maxDecimals(peorCasoAciertosEnNegative,2)+'+'+
    maxDecimals(Math.min(probFPcuandoP * cantidadNegative - peorCasoAciertosEnNegative, cantidadModelo2FP),2)+
    ') * '+costoNegative+' = '+
    maxDecimals((peorCasoAciertosEnPositive +
    Math.min(probFNcuandoN * cantidadPositive - peorCasoAciertosEnPositive, cantidadModelo2FN)) * 
    costoPositive + 
    (peorCasoAciertosEnNegative + 
    Math.min(probFPcuandoP * cantidadNegative - peorCasoAciertosEnNegative, cantidadModelo2FP)) * 
    costoNegative,2);
}