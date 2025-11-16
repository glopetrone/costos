import numpy as np




def andFusionadorFalloDadoResultado2Promedio(probabilidadesPositive, probabilidadesNegative):
    probFNcuandoP = probabilidadesPositive[1]/(probabilidadesPositive[1]+probabilidadesPositive[3]) if (probabilidadesPositive[1]+probabilidadesPositive[3]) > 0 else 0
    probFPcuandoN = 0
    probFNcuandoN = 1
    probFPcuandoP = probabilidadesNegative[0]/(probabilidadesNegative[0]+probabilidadesNegative[2]) if (probabilidadesNegative[0]+probabilidadesNegative[2]) > 0 else 0
    return  [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP]




def orFusionadorFalloDadoResultado2Promedio(probabilidadesPositive, probabilidadesNegative):
    probFNcuandoP = 0
    probFPcuandoN = probabilidadesNegative[1]/(probabilidadesNegative[1]+probabilidadesNegative[3]) if (probabilidadesNegative[1]+probabilidadesNegative[3]) > 0 else 0
    probFNcuandoN = probabilidadesPositive[0]/(probabilidadesPositive[0]+probabilidadesPositive[2]) if (probabilidadesPositive[0]+probabilidadesPositive[2]) > 0 else 0
    probFPcuandoP = 1
    return  [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP]




def andFusionadorFalloDadoResultado2Instancias(instanciasPositive, instanciasNegative):
    cantidadFNcuandoP = np.sum(np.logical_and(instanciasPositive[:,0] == 0, instanciasPositive[:,1] == 1))
    cantidadFNcuandoN = np.sum(instanciasPositive[:,1] == 0)
    cantidadModelo2TP = np.sum(instanciasPositive[:,1] == 1)
    cantidadModelo2FN = np.sum(instanciasPositive[:,1] == 0)

    cantidadFPcuandoN = 0 
    cantidadFPcuandoP = np.sum(np.logical_and(instanciasNegative[:,0] == 0, instanciasNegative[:,1] == 0))
    cantidadModelo2TN = np.sum(instanciasNegative[:,1] == 1)
    cantidadModelo2FP = np.sum(instanciasNegative[:,1] == 0)

    probFNcuandoP = 0 if cantidadModelo2TP == 0 else cantidadFNcuandoP / cantidadModelo2TP
    probFPcuandoN = 0 if cantidadModelo2TN == 0 else cantidadFPcuandoN / cantidadModelo2TN
    probFNcuandoN = 0 if cantidadModelo2FN == 0 else cantidadFNcuandoN / cantidadModelo2FN
    probFPcuandoP = 0 if cantidadModelo2FP == 0 else cantidadFPcuandoP / cantidadModelo2FP

    return [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP]




def orFusionadorFalloDadoResultado2Instancias(instanciasPositive, instanciasNegative):
    cantidadFNcuandoP = 0
    cantidadFNcuandoN = np.sum(np.logical_and(instanciasPositive[:,0] == 0, instanciasPositive[:,1] == 0))
    cantidadModelo2TP = np.sum(instanciasPositive[:,1] == 1)
    cantidadModelo2FN = np.sum(instanciasPositive[:,1] == 0)

    cantidadFPcuandoN = np.sum(np.logical_and(instanciasNegative[:,0] == 0, instanciasNegative[:,1] == 1))
    cantidadFPcuandoP = np.sum(instanciasNegative[:,1] == 0)
    cantidadModelo2TN = np.sum(instanciasNegative[:,1] == 1)
    cantidadModelo2FP = np.sum(instanciasNegative[:,1] == 0)
    
    probFNcuandoP = 0 if cantidadModelo2TP == 0 else cantidadFNcuandoP / cantidadModelo2TP
    probFPcuandoN = 0 if cantidadModelo2TN == 0 else cantidadFPcuandoN / cantidadModelo2TN
    probFNcuandoN = 0 if cantidadModelo2FN == 0 else cantidadFNcuandoN / cantidadModelo2FN
    probFPcuandoP = 0 if cantidadModelo2FP == 0 else cantidadFPcuandoP / cantidadModelo2FP

    return  [probFNcuandoP, probFPcuandoN, probFNcuandoN, probFPcuandoP]




def andFusionadorAciertoPromedio(probabilidadesPositive, probabilidadesNegative):
    return  [probabilidadesPositive[3], probabilidadesNegative[1] + probabilidadesNegative[2] + probabilidadesNegative[3]]




def orFusionadorAciertoPromedio(probabilidadesPositive, probabilidadesNegative):
    return  [probabilidadesPositive[1] + probabilidadesPositive[2] + probabilidadesPositive[3], probabilidadesNegative[3]]




def andFusionadorAciertoInstancias(instanciasPositive, instanciasNegative):
    # Devuelve 1 si el fusionador predice que la instancia es de clase Positiva

    resultadosPositive = np.zeros(len(instanciasPositive))
    resultadosNegative = np.zeros(len(instanciasNegative))

    resultadosPositive[np.logical_and(instanciasPositive[:,0] == 1, instanciasPositive[:,1] == 1)] = 1
    resultadosNegative[np.logical_and(instanciasNegative[:,0] == 0, instanciasNegative[:,1] == 0)] = 1
    
    return [resultadosPositive, resultadosNegative]




def orFusionadorAciertoInstancias(instanciasPositive, instanciasNegative):
    # Devuelve 1 si el fusionador predice que la instancia es de clase Positiva

    resultadosPositive = np.zeros(len(instanciasPositive))
    resultadosNegative = np.zeros(len(instanciasNegative))

    resultadosPositive[np.logical_or(instanciasPositive[:,0] == 1, instanciasPositive[:,1] == 1)] = 1
    resultadosNegative[np.logical_or(instanciasNegative[:,0] == 0, instanciasNegative[:,1] == 0)] = 1

    return [resultadosPositive, resultadosNegative]