const m1AccPositiveElement = document.getElementById("m1-acc-positive");
const m1AccNegativeElement = document.getElementById("m1-acc-negative");

const m2AccPositiveElement = document.getElementById("m2-acc-positive");
const m2AccNegativeElement = document.getElementById("m2-acc-negative");

const correlacionPositiveElement = document.getElementById("correlacion-positive");
const correlacionNegativeElement = document.getElementById("correlacion-negative");

const costoPositiveElement = document.getElementById("costo-positive");
const costoNegativeElement = document.getElementById("costo-negative");

const cantidadPositiveElement = document.getElementById("cantidad-positive");
const cantidadNegativeElement = document.getElementById("cantidad-negative");

const tipoFusionador = document.getElementById("tipo");

const sumaTPelement = document.getElementById("suma-tp");
const sumaTNelement = document.getElementById("suma-tn");
const sumaFNelement = document.getElementById("suma-fn");
const sumaFPelement = document.getElementById("suma-fp");

const restaTPelement = document.getElementById("resta-tp");
const restaTNelement = document.getElementById("resta-tn");
const restaFNelement = document.getElementById("resta-fn");
const restaFPelement = document.getElementById("resta-fp");

const evalSistemaElement = document.getElementById("eval-sistema");
const sumaEvalModelo2Element = document.getElementById("suma-eval-modelo2");
const restaEvalModelo2Element = document.getElementById("resta-eval-modelo2");

const colorFondoPaginaElement = document.getElementById("page-background-color");
const colorContainerPaginaElement = document.getElementById("container-background-color");

const bodyElement = document.body;
const containerElement = document.getElementById("container");




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

    sumaTPelement.value = (probFNcuandoP * costoPositiveElement.value).toFixed(6);
    sumaTNelement.value = (probFPcuandoN * costoNegativeElement.value).toFixed(6);
    sumaFNelement.value = (probFNcuandoN * costoPositiveElement.value).toFixed(6);
    sumaFPelement.value = (probFPcuandoP * costoNegativeElement.value).toFixed(6);

    restaTPelement.value = (sumaTPelement.value - sumaTPelement.value).toFixed(6);
    restaTNelement.value = (sumaTNelement.value - sumaTNelement.value).toFixed(6);
    restaFNelement.value = (sumaFNelement.value - sumaTPelement.value).toFixed(6);
    restaFPelement.value = (sumaFPelement.value - sumaTNelement.value).toFixed(6);

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
    cantidadSistemaFN.toFixed(0)+'*'+costoPositive.toFixed(2)+' + '+
    cantidadSistemaFP.toFixed(0)+'*'+costoNegative.toFixed(2)+'  =  '+
    (cantidadSistemaFN*costoPositive+
    cantidadSistemaFP*costoNegative).toFixed(2);




    // Evaluación modelo 2

    sumaEvalModelo2Element.value = 
    cantidadModelo2TP.toFixed(0)+'*'+sumaTP.toFixed(2)+' + '+
    cantidadModelo2TN.toFixed(0)+'*'+sumaTN.toFixed(2)+' + '+
    cantidadModelo2FN.toFixed(0)+'*'+sumaFN.toFixed(2)+' + '+
    cantidadModelo2FP.toFixed(0)+'*'+sumaFP.toFixed(2)+'  =  '+
    (cantidadModelo2TP * sumaTP + 
    cantidadModelo2TN * sumaTN + 
    cantidadModelo2FN * sumaFN + 
    cantidadModelo2FP * sumaFP).toFixed(2);

    restaEvalModelo2Element.value = 
    cantidadModelo2TP.toFixed(0)+'*'+restaTP.toFixed(2)+' + '+
    cantidadModelo2TN.toFixed(0)+'*'+restaTN.toFixed(2)+' + '+
    cantidadModelo2FN.toFixed(0)+'*'+restaFN.toFixed(2)+' + '+
    cantidadModelo2FP.toFixed(0)+'*'+restaFP.toFixed(2)+'  =  '+
    (cantidadModelo2TP * restaTP + 
    cantidadModelo2TN * restaTN + 
    cantidadModelo2FN * restaFN + 
    cantidadModelo2FP * restaFP).toFixed(2);
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


    for(const [predM1, predM2] of instanciasPositive){
        // Confusiónes modelo 2
        if(predM2 == 1){
            cantidadModelo2TP = cantidadModelo2TP + 1;
        }else{
            cantidadModelo2FN = cantidadModelo2FN + 1;
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
        cantidadSistemaTN = cantidadSistemaTN;
        cantidadSistemaFP = cantidadSistemaFP;
    }




    // Evaluación del sistema

    evalSistemaElement.value = 
    cantidadSistemaFN.toFixed(0)+'*'+costoPositive.toFixed(2)+' + '+
    cantidadSistemaFP.toFixed(0)+'*'+costoNegative.toFixed(2)+'  =  '+
    (cantidadSistemaFN*costoPositive+
    cantidadSistemaFP*costoNegative).toFixed(2);


    // Evaluación modelo 2

    sumaEvalModelo2Element.value = 
    cantidadModelo2TP.toFixed(0)+'*'+sumaTP.toFixed(2)+' + '+
    cantidadModelo2TN.toFixed(0)+'*'+sumaTN.toFixed(2)+' + '+
    cantidadModelo2FN.toFixed(0)+'*'+sumaFN.toFixed(2)+' + '+
    cantidadModelo2FP.toFixed(0)+'*'+sumaFP.toFixed(2)+'  =  '+
    (cantidadModelo2TP * sumaTP + 
    cantidadModelo2TN * sumaTN + 
    cantidadModelo2FN * sumaFN + 
    cantidadModelo2FP * sumaFP).toFixed(2);

    restaEvalModelo2Element.value = 
    cantidadModelo2TP.toFixed(0)+'*'+restaTP.toFixed(2)+' + '+
    cantidadModelo2TN.toFixed(0)+'*'+restaTN.toFixed(2)+' + '+
    cantidadModelo2FN.toFixed(0)+'*'+restaFN.toFixed(2)+' + '+
    cantidadModelo2FP.toFixed(0)+'*'+restaFP.toFixed(2)+'  =  '+
    (cantidadModelo2TP * restaTP + 
    cantidadModelo2TN * restaTN + 
    cantidadModelo2FN * restaFN + 
    cantidadModelo2FP * restaFP).toFixed(2);
}




function generateCorrelatedBernoulli(p, q, rho, n){
    const jointProbabilities = computeJointBernoulliProbabilities(p, q, rho);

    // Generate n pairs of (X, Y)
    const result = [];
    for (let i = 0; i < n; i++) {
        // Generate X
        let randomNumber = Math.random();

        if(randomNumber < jointProbabilities[0]){
            result.push([0,0]);
        }else if(randomNumber < jointProbabilities[0] + jointProbabilities[1]){
            result.push([0,1]);
        }else if(randomNumber < jointProbabilities[0] + jointProbabilities[1] + jointProbabilities[2]){
            result.push([1,0]);
        }else{
            result.push([1,1]);
        }
    }

    return result;
}




function computeJointBernoulliProbabilities(p, q, rho) {
    if (p < 0 || p > 1 || q < 0 || q > 1 || rho < -1 || rho > 1) {
        throw new Error("Invalid inputs: p, q must be in [0,1], rho in [-1,1]");
    }

    // Compute variance terms
    const varX = p * (1 - p);
    const varY = q * (1 - q);
    const stdProd = Math.sqrt(varX * varY);

    // Compute joint probability P(X=1, Y=1)
    const p11 = p * q + rho * stdProd;

    // Check if joint probability is valid
    const minJoint = Math.max(0, p + q - 1);
    const maxJoint = Math.min(p, q);
    if (p11 < minJoint || p11 > maxJoint) {
        throw new Error(`Invalid correlation: rho=${rho} is not achievable with p=${p}, q=${q}. ` +
                        `P(1,1)=${p11} must be in [${minJoint}, ${maxJoint}]`);
    }

    // Compute other probabilities
    const p10 = p - p11;  // P(X=1, Y=0)
    const p01 = q - p11;  // P(X=0, Y=1)
    const p00 = 1 - p - q + p11;  // P(X=0, Y=0)

    // Ensure all probabilities are non-negative (should be if constraints hold)
    if (p00 < 0 || p01 < 0 || p10 < 0 || p11 < 0) {
        throw new Error("Computed probabilities include negative values; check inputs.");
    }

    return [p00, p01, p10, p11];
}



function cambiarColor(){
    bodyElement.style.backgroundColor = colorFondoPaginaElement.value;
    containerElement.style.backgroundColor = colorContainerPaginaElement.value;
}