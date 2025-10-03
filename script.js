import { maxDecimals } from "./utils.js";
import { generateCorrelatedBernoulli, computeJointBernoulliProbabilities } from "./distribuciones.js";

const m1AccPositiveElement = document.getElementById("m1-acc-positive");
const m1AccNegativeElement = document.getElementById("m1-acc-negative");

const m2AccPositiveElement = document.getElementById("m2-acc-positive");
const m2AccNegativeElement = document.getElementById("m2-acc-negative");

const tipoFusionador = document.getElementById("tipo");

const correlacionPositiveElement = document.getElementById("correlacion-positive");
const correlacionNegativeElement = document.getElementById("correlacion-negative");

const costoPositiveElement = document.getElementById("costo-positive");
const costoNegativeElement = document.getElementById("costo-negative");

const cantidadPositiveElement = document.getElementById("cantidad-positive");
const cantidadNegativeElement = document.getElementById("cantidad-negative");

const sumaTPelement = document.getElementById("suma-tp");
const sumaTNelement = document.getElementById("suma-tn");
const sumaFNelement = document.getElementById("suma-fn");
const sumaFPelement = document.getElementById("suma-fp");

const restaTPelement = document.getElementById("resta-tp");
const restaTNelement = document.getElementById("resta-tn");
const restaFNelement = document.getElementById("resta-fn");
const restaFPelement = document.getElementById("resta-fp");

const peorCasoSistemaElement = document.getElementById("peor-caso-sistema");
const evalSistemaElement = document.getElementById("eval-sistema");
const sumaEvalModelo2Element = document.getElementById("suma-eval-modelo2");
const restaEvalModelo2Element = document.getElementById("resta-eval-modelo2");

const calculateCostBtnElement = document.getElementById("calculate-cost-btn");
const estimateEvaluationBtnElement = document.getElementById("estimate-evaluation-btn");
const generateInstancesBtnElement = document.getElementById("generate-instances-btn");




export function eventListeners(){
    calculateCostBtnElement.addEventListener('click', calcularCostos);
    estimateEvaluationBtnElement.addEventListener('click', estimarEvaluacion);
    generateInstancesBtnElement.addEventListener('click', generarInstancias);
}




function calcularCostos(){

    // probabilidad de resultado del sistema cuando el modelo 2 realiza cierta prediccion

    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;

    let m1AccPositive = parseFloat(m1AccPositiveElement.value);
    let m1AccNegative = parseFloat(m1AccNegativeElement.value);

    if(tipoFusionador.value == 'or'){
        probFNcuandoP = 0;
        probFPcuandoN = 1 - m1AccNegative;
        probFNcuandoN = 1 - m1AccPositive;
        probFPcuandoP = 1;
    }else if(tipoFusionador.value == 'and'){
        probFNcuandoP = 1 - m1AccPositive;
        probFPcuandoN = 0;
        probFNcuandoN = 1;
        probFPcuandoP = 1 - m1AccNegative;
    }else{
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }

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

    let cantidadPositive = parseFloat(cantidadPositiveElement.value);
    let cantidadNegative = parseFloat(cantidadNegativeElement.value);




    // Calcular confusiónes

    let cantidadSistemaTP = 0;
    let cantidadSistemaTN = 0;
    let cantidadSistemaFN = 0;
    let cantidadSistemaFP = 0;

    let cantidadModelo2TP = 0;
    let cantidadModelo2TN = 0;
    let cantidadModelo2FN = 0;
    let cantidadModelo2FP = 0;
    



    // Versión sin generar instancias calculando la probabilidad conjunta y multiplicando por la cantidad
    // La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente

    let probabilidadesPositive = computeJointBernoulliProbabilities(m1AccPositive, m2AccPositive, correlacionPositive);
    let probabilidadesNegative = computeJointBernoulliProbabilities(m1AccNegative, m2AccNegative, correlacionNegative);

    if(tipoFusionador.value == 'or'){
        cantidadSistemaTP = probabilidadesPositive[1] + probabilidadesPositive[2] + probabilidadesPositive[3];
        cantidadSistemaTN = probabilidadesNegative[3];
        cantidadSistemaFN = probabilidadesPositive[0];
        cantidadSistemaFP = probabilidadesNegative[0] + probabilidadesNegative[1] + probabilidadesNegative[2];
    }else if(tipoFusionador.value == 'and'){
        cantidadSistemaTP = probabilidadesPositive[3];
        cantidadSistemaTN =  + probabilidadesNegative[1] + probabilidadesNegative[2] + probabilidadesNegative[3];
        cantidadSistemaFN = probabilidadesPositive[0] + probabilidadesPositive[1] + probabilidadesPositive[2];
        cantidadSistemaFP = probabilidadesNegative[0];
    }else{
        throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
    }

    cantidadSistemaTP = cantidadSistemaTP * cantidadPositive;
    cantidadSistemaTN = cantidadSistemaTN * cantidadNegative;
    cantidadSistemaFN = cantidadSistemaFN * cantidadPositive;
    cantidadSistemaFP = cantidadSistemaFP * cantidadNegative;

    cantidadModelo2TP = cantidadPositive * m2AccPositive;
    cantidadModelo2TN = cantidadNegative * m2AccNegative;
    cantidadModelo2FN = cantidadPositive * (1 - m2AccPositive);
    cantidadModelo2FP = cantidadNegative * (1 - m2AccNegative);




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




    // Costo Peor Caso

    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;

    if(tipoFusionador.value == 'or'){
        probFNcuandoP = 0;
        probFPcuandoN = 1 - m1AccNegative;
        probFNcuandoN = 1 - m1AccPositive;
        probFPcuandoP = 1;
    }else if(tipoFusionador.value == 'and'){
        probFNcuandoP = 1 - m1AccPositive;
        probFPcuandoN = 0;
        probFNcuandoN = 1;
        probFPcuandoP = 1 - m1AccNegative;
    }else{
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

    let cantidadPositive = parseFloat(cantidadPositiveElement.value);
    let cantidadNegative = parseFloat(cantidadNegativeElement.value);




    // Calcular confusiónes

    let cantidadSistemaTP = 0;
    let cantidadSistemaTN = 0;
    let cantidadSistemaFN = 0;
    let cantidadSistemaFP = 0;

    let cantidadModelo2TP = 0;
    let cantidadModelo2TN = 0;
    let cantidadModelo2FN = 0;
    let cantidadModelo2FP = 0;
    
    

    
    // Versión generando instancias en base a la probabilidad conjunta
    // La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente

    let instanciasPositive = generateCorrelatedBernoulli(m1AccPositive, m2AccPositive, correlacionPositive, cantidadPositive);
    let instanciasNegative = generateCorrelatedBernoulli(m1AccNegative, m2AccNegative, correlacionNegative, cantidadNegative);
    let aciertosM1Positive = 0;
    let aciertosM1Negative = 0;
    

    for(const [predM1, predM2] of instanciasPositive){
        // Confusiónes modelo 2
        if(predM2 == 1){
            cantidadModelo2TP = cantidadModelo2TP + 1;
        }else{
            cantidadModelo2FN = cantidadModelo2FN + 1;
        }

        if(predM1 == 1){
            aciertosM1Positive = aciertosM1Positive + 1;
        }



        // Confusiónes sistema
        if(tipoFusionador.value == 'or'){
            if(predM1 == 0 && predM2 == 0){
                cantidadSistemaFN = cantidadSistemaFN + 1;
            }else{
                cantidadSistemaTP = cantidadSistemaTP + 1;
            }
        }
        else if(tipoFusionador.value == 'and'){
            if(predM1 == 1 && predM2 == 1){
                cantidadSistemaTP = cantidadSistemaTP + 1;
            }else{
                cantidadSistemaFN = cantidadSistemaFN + 1;
            }
        }
        else{
            throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
        }
        cantidadSistemaTP = cantidadSistemaTP;
        cantidadSistemaFN = cantidadSistemaFN;
    }


    for(const [predM1, predM2] of instanciasNegative){
        // Confusiónes modelo 2
        if(predM2 == 1){
            cantidadModelo2TN = cantidadModelo2TN + 1;
        }else{
            cantidadModelo2FP = cantidadModelo2FP + 1;
        }

        if(predM1 == 1){
            aciertosM1Negative = aciertosM1Negative + 1;
        }

        // Confusiónes sistema
        if(tipoFusionador.value == 'or'){
            if(predM1 == 1 && predM2 == 1){
                cantidadSistemaTN = cantidadSistemaTN + 1;
            }else{
                cantidadSistemaFP = cantidadSistemaFP + 1;
            }
        }
        else if(tipoFusionador.value == 'and'){
            if(predM1 == 0 && predM2 == 0){
                cantidadSistemaFP = cantidadSistemaFP + 1;
            }else{
                cantidadSistemaTN = cantidadSistemaTN + 1;
            }
        }
        else{
            throw new Error("Fusionador no soportado. Usar 'or' o 'and'.");
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




    // Costo Peor Caso

    let probFNcuandoP;
    let probFPcuandoN;
    let probFNcuandoN;
    let probFPcuandoP;

    if(tipoFusionador.value == 'or'){
        probFNcuandoP = 0;
        probFPcuandoN = 1 - m1AccNegative;
        probFNcuandoN = 1 - m1AccPositive;
        probFPcuandoP = 1;
    }else if(tipoFusionador.value == 'and'){
        probFNcuandoP = 1 - m1AccPositive;
        probFPcuandoN = 0;
        probFNcuandoN = 1;
        probFPcuandoP = 1 - m1AccNegative;
    }else{
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