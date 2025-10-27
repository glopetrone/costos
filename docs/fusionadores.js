export function andFusionadorFalloIntervencionResultado2Promedio(accuracyPositive, accuracyNegative){
    return  [1 - accuracyPositive,
            0,
            1,
            1 - accuracyNegative];
}




export function orFusionadorFalloIntervencionResultado2Promedio(accuracyPositive, accuracyNegative){
    return  [0,
            1 - accuracyNegative,
            1 - accuracyPositive,
            1];
}




export function andFusionadorFalloDadoResultado2Promedio(probabilidadesPositive, probabilidadesNegative){
    return  [probabilidadesPositive[1]/(probabilidadesPositive[1]+probabilidadesPositive[3]),
            0,
            1,
            probabilidadesNegative[0]/(probabilidadesNegative[0]+probabilidadesNegative[2])];
}




export function orFusionadorFalloDadoResultado2Promedio(probabilidadesPositive, probabilidadesNegative){
    return  [0,
            probabilidadesNegative[1]/(probabilidadesNegative[1]+probabilidadesNegative[3]),
            probabilidadesPositive[0]/(probabilidadesPositive[0]+probabilidadesPositive[2]),
            1];
}




export function andFusionadorFalloIntervencionResultado2Instancias(instanciasPositive, instanciasNegative){
    let instanciasPositiveIntervenidas = [];
    let instanciasNegativeIntervenidas = [];
    for(const instancia of instanciasPositive){
        instanciasPositiveIntervenidas.push([instancia[0], 1]);
    }
    for(const instancia of instanciasNegative){
        instanciasNegativeIntervenidas.push([instancia[0], 1]);
    }
    
    let probFNcuandoP;
    let probFPcuandoN;
    [probFNcuandoP, probFPcuandoN] =  
    andFusionadorFalloDadoResultado2Instancias(instanciasPositiveIntervenidas, instanciasNegativeIntervenidas);

    instanciasPositiveIntervenidas = [];
    instanciasNegativeIntervenidas = [];
    for(const instancia of instanciasPositive){
        instanciasPositiveIntervenidas.push([instancia[0], 0]);
    }
    for(const instancia of instanciasNegative){
        instanciasNegativeIntervenidas.push([instancia[0], 0]);
    }
    
    let probFNcuandoN;
    let probFPcuandoP;
    [, , probFNcuandoN, probFPcuandoP] =  
    andFusionadorFalloDadoResultado2Instancias(instanciasPositiveIntervenidas, instanciasNegativeIntervenidas);

    return [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP];
}




export function orFusionadorFalloIntervencionResultado2Instancias(instanciasPositive, instanciasNegative){
    let instanciasPositiveIntervenidas = [];
    let instanciasNegativeIntervenidas = [];
    for(const instancia of instanciasPositive){
        instanciasPositiveIntervenidas.push([instancia[0], 1]);
    }
    for(const instancia of instanciasNegative){
        instanciasNegativeIntervenidas.push([instancia[0], 1]);
    }
    
    let probFNcuandoP;
    let probFPcuandoN;
    [probFNcuandoP, probFPcuandoN] =  
    orFusionadorFalloDadoResultado2Instancias(instanciasPositiveIntervenidas, instanciasNegativeIntervenidas);

    instanciasPositiveIntervenidas = [];
    instanciasNegativeIntervenidas = [];
    for(const instancia of instanciasPositive){
        instanciasPositiveIntervenidas.push([instancia[0], 0]);
    }
    for(const instancia of instanciasNegative){
        instanciasNegativeIntervenidas.push([instancia[0], 0]);
    }
    
    let probFNcuandoN;
    let probFPcuandoP;
    [, , probFNcuandoN, probFPcuandoP] =  
    orFusionadorFalloDadoResultado2Instancias(instanciasPositiveIntervenidas, instanciasNegativeIntervenidas);

    return [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP];
}




export function andFusionadorFalloDadoResultado2Instancias(instanciasPositive, instanciasNegative){
    let cantidadFNcuandoP = 0; 
    let cantidadFNcuandoN = 0; 
    let cantidadModelo2TP = 0;
    let cantidadModelo2FN = 0;
    
    for(const [predM1, predM2] of instanciasPositive){
        if(!(predM1 && predM2)){
            if(predM2){
                cantidadFNcuandoP = cantidadFNcuandoP + 1;
            }else if(!predM2){
                cantidadFNcuandoN = cantidadFNcuandoN + 1;
            }
        }
        if(predM2){
            cantidadModelo2TP = cantidadModelo2TP + 1;
        }else{
            cantidadModelo2FN = cantidadModelo2FN + 1;
        }
    }

    let cantidadFPcuandoN = 0; 
    let cantidadFPcuandoP = 0;
    let cantidadModelo2TN = 0;
    let cantidadModelo2FP = 0;

    for(const [predM1, predM2] of instanciasNegative){
        if(!predM1 && !predM2){
            if(predM2){
                cantidadFPcuandoN = cantidadFPcuandoN + 1;
            }else if(!predM2){
                cantidadFPcuandoP = cantidadFPcuandoP + 1;
            }
        }
        if(predM2){
            cantidadModelo2TN = cantidadModelo2TN + 1;
        }else{
            cantidadModelo2FP = cantidadModelo2FP + 1;
        }
    }

    let probFNcuandoP = cantidadModelo2TP == 0 ? 0 : cantidadFNcuandoP / cantidadModelo2TP;
    let probFPcuandoN = cantidadModelo2TN == 0 ? 0 : cantidadFPcuandoN / cantidadModelo2TN;
    let probFNcuandoN = cantidadModelo2FN == 0 ? 0 : cantidadFNcuandoN / cantidadModelo2FN;
    let probFPcuandoP = cantidadModelo2FP == 0 ? 0 : cantidadFPcuandoP / cantidadModelo2FP;

    return  [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP];
}




export function orFusionadorFalloDadoResultado2Instancias(instanciasPositive, instanciasNegative){
    let cantidadFNcuandoP = 0; 
    let cantidadFNcuandoN = 0; 
    let cantidadModelo2TP = 0;
    let cantidadModelo2FN = 0;
    
    for(const [predM1, predM2] of instanciasPositive){
        if(!(predM1 || predM2)){
            if(predM2){
                cantidadFNcuandoP = cantidadFNcuandoP + 1;
            }else if(!predM2){
                cantidadFNcuandoN = cantidadFNcuandoN + 1;
            }
        }
        if(predM2){
            cantidadModelo2TP = cantidadModelo2TP + 1;
        }else{
            cantidadModelo2FN = cantidadModelo2FN + 1;
        }
    }


    let cantidadFPcuandoN = 0; 
    let cantidadFPcuandoP = 0;
    let cantidadModelo2TN = 0;
    let cantidadModelo2FP = 0;

    for(const [predM1, predM2] of instanciasNegative){
        if(!predM1 || !predM2){
            if(predM2){
                cantidadFPcuandoN = cantidadFPcuandoN + 1;
            }else if(!predM2){
                cantidadFPcuandoP = cantidadFPcuandoP + 1;
            }
        }
        if(predM2){
            cantidadModelo2TN = cantidadModelo2TN + 1;
        }else{
            cantidadModelo2FP = cantidadModelo2FP + 1;
        }
    }
    
    let probFNcuandoP = cantidadModelo2TP == 0 ? 0 : cantidadFNcuandoP / cantidadModelo2TP;
    let probFPcuandoN = cantidadModelo2TN == 0 ? 0 : cantidadFPcuandoN / cantidadModelo2TN;
    let probFNcuandoN = cantidadModelo2FN == 0 ? 0 : cantidadFNcuandoN / cantidadModelo2FN;
    let probFPcuandoP = cantidadModelo2FP == 0 ? 0 : cantidadFPcuandoP / cantidadModelo2FP;

    return  [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP];
}




export function andFusionadorAciertoPromedio(probabilidadesPositive, probabilidadesNegative){
    return  [probabilidadesPositive[3],
            probabilidadesNegative[1] + probabilidadesNegative[2] + probabilidadesNegative[3]];
}




export function orFusionadorAciertoPromedio(probabilidadesPositive, probabilidadesNegative){
    return  [probabilidadesPositive[1] + probabilidadesPositive[2] + probabilidadesPositive[3],
            probabilidadesNegative[3]];
}




export function andFusionadorAciertoInstancias(instanciasPositive, instanciasNegative){
    // Devuelve 1 si el fusionador predice que la instancia es de clase Positiva

    let resultadosPositive = [];
    for(const [predM1, predM2] of instanciasPositive){
        if(predM1 && predM2){
            resultadosPositive.push(1);
        }else{
            resultadosPositive.push(0);
        }
    }

    let resultadosNegative = [];
    for(const [predM1, predM2] of instanciasNegative){
        if(!predM1 && !predM2){
            resultadosNegative.push(1);
        }else{
            resultadosNegative.push(0);
        }
    }
    
    return [resultadosPositive, resultadosNegative];
}




export function orFusionadorAciertoInstancias(instanciasPositive, instanciasNegative){
    // Devuelve 1 si el fusionador predice que la instancia es de clase Positiva

    let resultadosPositive = [];
    for(const [predM1, predM2] of instanciasPositive){
        if(predM1 || predM2){
            resultadosPositive.push(1);
        }else{
            resultadosPositive.push(0);
        }
    }

    let resultadosNegative = [];
    for(const [predM1, predM2] of instanciasNegative){
        if(!predM1 || !predM2){
            resultadosNegative.push(1);
        }else{
            resultadosNegative.push(0);
        }
    }
    
    return [resultadosPositive, resultadosNegative];
}