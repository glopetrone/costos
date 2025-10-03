const correlacionPositiveElement = document.getElementById("correlacion-positive");
const correlacionNegativeElement = document.getElementById("correlacion-negative");
const m1AccPositiveElement = document.getElementById("m1-acc-positive");
const m1AccNegativeElement = document.getElementById("m1-acc-negative");
const m2AccPositiveElement = document.getElementById("m2-acc-positive");
const m2AccNegativeElement = document.getElementById("m2-acc-negative");




export function eventListeners(){
    const backgroundColorElement = document.getElementById("page-background-color");
    const containerColorElement = document.getElementById("container-background-color");

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




export function maxDecimals(number, decimalQuantity){
    let numberString = number.toString();
    if(numberString.includes('.')){
        numberString = numberString.slice(0, Math.min(numberString.indexOf('.')+decimalQuantity+1, numberString.length));
        let idx = numberString.length-1;
        while(numberString[idx] == '0'){
            numberString = numberString.slice(0, idx);
            idx = idx - 1;
        }
        if(numberString[idx] == ['.']){
            numberString = numberString.slice(0, idx);
        }
    }
    return numberString;
}




function cambiarColor(){
    document.body.style.backgroundColor = document.getElementById("page-background-color").value;
    document.getElementById("container").style.backgroundColor = document.getElementById("container-background-color").value;
}




function respetarLimites(){
    let correlacionPositive = correlacionPositiveElement.value;

    let p = parseFloat(m1AccPositiveElement.value);
    let q = parseFloat(m2AccPositiveElement.value);

    let varX = p * (1 - p);
    let varY = q * (1 - q);
    let stdProd = Math.sqrt(varX * varY);
    
    let minJoint = Math.max(0, p + q - 1);
    let maxJoint = Math.min(p, q);

    let correlacionMin = stdProd != 0 ? (minJoint - p*q) / stdProd : 0;
    let correlacionMax = stdProd != 0 ? (maxJoint - p*q) / stdProd : 0;

    if(correlacionPositive < correlacionMin){
        correlacionPositiveElement.value = correlacionMin;
    }
    if(correlacionPositive > correlacionMax){
        correlacionPositiveElement.value = correlacionMax;
    }




    let correlacionNegative = correlacionNegativeElement.value;

    p = parseFloat(m1AccNegativeElement.value);
    q = parseFloat(m2AccNegativeElement.value);
    
    varX = p * (1 - p);
    varY = q * (1 - q);
    stdProd = Math.sqrt(varX * varY);

    minJoint = Math.max(0, p + q - 1);
    maxJoint = Math.min(p, q);

    correlacionMin = stdProd != 0 ? (minJoint - p*q) / stdProd : 0;
    correlacionMax = stdProd != 0 ? (maxJoint - p*q) / stdProd : 0;

    if(correlacionNegative < correlacionMin){
        correlacionNegativeElement.value = correlacionMin;
    }
    if(correlacionNegative > correlacionMax){
        correlacionNegativeElement.value = correlacionMax;
    }
}