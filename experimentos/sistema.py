from distribuciones import generateCorrelatedBernoulli, computeJointBernoulliProbabilities, validBernoulliJointProbabilityWithCorrelation
import fusionador as fusionadores
import numpy as np


class Sistema():

    def __init__(self, m1AccPositive = 0.5, m1AccNegative = 0.5, m2AccPositive = 0.5, m2AccNegative = 0.5, tipoFusionador = 'or', correlacionPositive = 0, correlacionNegative = 0, costoPositive = 1, costoNegative = 1):

        [correlacionMinPositive, correlacionMaxPositive] = validBernoulliJointProbabilityWithCorrelation(m1AccPositive, m2AccPositive)
        [correlacionMinNegative, correlacionMaxNegative] = validBernoulliJointProbabilityWithCorrelation(m1AccNegative, m2AccNegative)
        
        if(correlacionPositive < correlacionMinPositive or correlacionPositive > correlacionMaxPositive):
            raise Exception('Correlación {:.2f} no es posible para probabilidades {:.2f} y {:.2f} clase Positive. \nUsar un valor entre [{:.2f} y {:.2f}]'.format(correlacionPositive, m1AccPositive, m2AccPositive, correlacionMinPositive, correlacionMaxPositive))
        
        if(correlacionNegative < correlacionMinNegative or correlacionNegative > correlacionMaxNegative):
            raise Exception('Correlación {:.2f} no es posible para probabilidades {:.2f} y {:.2f} clase Negative. \nUsar un valor entre [{:.2f} y {:.2f}]'.format(correlacionNegative, m1AccNegative, m2AccNegative, correlacionMinNegative, correlacionMaxNegative))
    

        self.m1AccPositive = m1AccPositive
        self.m1AccNegative = m1AccNegative

        self.m2AccPositive = m2AccPositive
        self.m2AccNegative = m2AccNegative

        self.tipoFusionador = tipoFusionador

        self.correlacionPositive = correlacionPositive
        self.correlacionNegative = correlacionNegative

        self.costoPositive = costoPositive
        self.costoNegative = costoNegative

        self.sumaTP = None
        self.sumaTN = None
        self.sumaFN = None
        self.sumaFP = None

        self.restaTP = None
        self.restaTN = None
        self.restaFN = None
        self.restaFP = None

        self.probFNcuandoP = None
        self.probFPcuandoN = None
        self.probFNcuandoN = None
        self.probFPcuandoP = None

        self.peorCasoSistema = None
        self.evalSistema = None
        self.sumaEvalModelo2 = None
        self.restaEvalModelo2 = None




    def estimarSistema(self):

        # La función devuelve [p(fallo, fallo), p(fallo, acierto), p(acierto, fallo), p(acierto, acierto)]

        probabilidadesPositive = computeJointBernoulliProbabilities(self.m1AccPositive, self.m2AccPositive, self.correlacionPositive)
        probabilidadesNegative = computeJointBernoulliProbabilities(self.m1AccNegative, self.m2AccNegative, self.correlacionNegative)


        # Intervencion Modelo 2

        probabilidadesPositiveIntervenidasAcertando = np.array([0, probabilidadesPositive[0]+probabilidadesPositive[1], 0, probabilidadesPositive[2]+probabilidadesPositive[3]])
        probabilidadesNegativeIntervenidasAcertando = np.array([0, probabilidadesNegative[0]+probabilidadesNegative[1], 0, probabilidadesNegative[2]+probabilidadesNegative[3]])

        probabilidadesPositiveIntervenidasFallando = np.array([probabilidadesPositive[0]+probabilidadesPositive[1], 0, probabilidadesPositive[2]+probabilidadesPositive[3], 0])
        probabilidadesNegativeIntervenidasFallando = np.array([probabilidadesNegative[0]+probabilidadesNegative[1], 0, probabilidadesNegative[2]+probabilidadesNegative[3], 0])


        # Correr Fusionador

        function_name = self.tipoFusionador+"FusionadorFalloDadoResultado2Promedio"

        if hasattr(fusionadores, function_name):
            func = getattr(fusionadores, function_name)
            if callable(func):
                [self.probFNcuandoP, self.probFPcuandoN, _, _] = func(probabilidadesPositiveIntervenidasAcertando, probabilidadesNegativeIntervenidasAcertando)
                [_, _, self.probFNcuandoN, self.probFPcuandoP] = func(probabilidadesPositiveIntervenidasFallando, probabilidadesNegativeIntervenidasFallando)
            else:
                raise Exception("Error inesperado!!!")
        else:
            raise Exception("Fusionador no soportado. Usar 'or' o 'and'.")


        # Costos para el modelo 2

        self.sumaTP = float(self.probFNcuandoP * self.costoPositive)
        self.sumaTN = float(self.probFPcuandoN * self.costoNegative)
        self.sumaFN = float(self.probFNcuandoN * self.costoPositive)
        self.sumaFP = float(self.probFPcuandoP * self.costoNegative)

        self.restaTP = float(self.sumaTP - self.sumaTP)
        self.restaTN = float(self.sumaTN - self.sumaTN)
        self.restaFN = float(self.sumaFN - self.sumaTP)
        self.restaFP = float(self.sumaFP - self.sumaTN)




    def testSistema(self, cantidadPositiveTestM1, cantidadNegativeTestM1):

        # La función devuelve 1 si la instancia acertó para su clase

        instanciasPositive = generateCorrelatedBernoulli(self.m1AccPositive, self.m2AccPositive, self.correlacionPositive, cantidadPositiveTestM1)
        instanciasNegative = generateCorrelatedBernoulli(self.m1AccNegative, self.m2AccNegative, self.correlacionNegative, cantidadNegativeTestM1)


        # Intervencion Modelo 2

        instanciasPositiveIntervenidasAcertando = np.copy(instanciasPositive)
        instanciasNegativeIntervenidasAcertando = np.copy(instanciasNegative)

        instanciasPositiveIntervenidasAcertando[:, 1] = 1
        instanciasNegativeIntervenidasAcertando[:, 1] = 1
        
        instanciasPositiveIntervenidasFallando = np.copy(instanciasPositive)
        instanciasNegativeIntervenidasFallando = np.copy(instanciasNegative)

        instanciasPositiveIntervenidasFallando[:, 1] = 0
        instanciasNegativeIntervenidasFallando[:, 1] = 0


        # Correr fusionador

        function_name = self.tipoFusionador+"FusionadorFalloDadoResultado2Instancias"

        if hasattr(fusionadores, function_name):
            func = getattr(fusionadores, function_name)
            if callable(func):
                [self.probFNcuandoP, self.probFPcuandoN, _, _] = func(instanciasPositiveIntervenidasAcertando, instanciasNegativeIntervenidasAcertando)
                [_, _, self.probFNcuandoN, self.probFPcuandoP] =  func(instanciasPositiveIntervenidasFallando, instanciasNegativeIntervenidasFallando)
            else:
                raise Exception("Error inesperado!!!")
        else:
            raise Exception("Fusionador no soportado. Usar 'or' o 'and'.")


        # Costos para el modelo 2

        self.sumaTP = float(self.probFNcuandoP * self.costoPositive)
        self.sumaTN = float(self.probFPcuandoN * self.costoNegative)
        self.sumaFN = float(self.probFNcuandoN * self.costoPositive)
        self.sumaFP = float(self.probFPcuandoP * self.costoNegative)

        self.restaTP = float(self.sumaTP - self.sumaTP)
        self.restaTN = float(self.sumaTN - self.sumaTN)
        self.restaFN = float(self.sumaFN - self.sumaTP)
        self.restaFP = float(self.sumaFP - self.sumaTN)




    def estimarModelo(self, cantidadPositiveTestM2, cantidadNegativeTestM2):

        # La función devuelve [p(fallo, fallo), p(fallo, acierto), p(acierto, fallo), p(acierto, acierto)]

        probabilidadesPositive = computeJointBernoulliProbabilities(self.m1AccPositive, self.m2AccPositive, self.correlacionPositive)
        probabilidadesNegative = computeJointBernoulliProbabilities(self.m1AccNegative, self.m2AccNegative, self.correlacionNegative)


        # Confusiones Modelo 2

        cantidadModelo2TP = int((probabilidadesPositive[1] + probabilidadesPositive[3]) * cantidadPositiveTestM2)
        cantidadModelo2TN = int((probabilidadesNegative[1] + probabilidadesNegative[3]) * cantidadNegativeTestM2)
        cantidadModelo2FN = int((probabilidadesPositive[0] + probabilidadesPositive[2]) * cantidadPositiveTestM2)
        cantidadModelo2FP = int((probabilidadesNegative[0] + probabilidadesNegative[2]) * cantidadNegativeTestM2)


        # Correr fusionador

        function_name = self.tipoFusionador+"FusionadorAciertoPromedio"

        if hasattr(fusionadores, function_name):
            func = getattr(fusionadores, function_name)
            if callable(func):
                [probabilidadAciertoSistemaPositive, probabilidadAciertoSistemaNegative] = func(probabilidadesPositive, probabilidadesNegative)
            else:
                raise Exception("Error inesperado!!!")
        else:
            raise Exception("Fusionador no soportado. Usar 'or' o 'and'.")
        

        # Confusiones sistema        

        cantidadSistemaTP = float(probabilidadAciertoSistemaPositive * cantidadPositiveTestM2)
        cantidadSistemaTN = float(probabilidadAciertoSistemaNegative * cantidadNegativeTestM2)
        cantidadSistemaFN = float(cantidadPositiveTestM2 - cantidadSistemaTP)
        cantidadSistemaFP = float(cantidadNegativeTestM2 - cantidadSistemaTN)


        # Evaluación del sistema

        self.evalSistema = float(cantidadSistemaFN * self.costoPositive + cantidadSistemaFP * self.costoNegative)


        # Evaluación modelo 2

        self.sumaEvalModelo2 = float(cantidadModelo2TP * self.sumaTP + cantidadModelo2TN * self.sumaTN + cantidadModelo2FN * self.sumaFN + cantidadModelo2FP * self.sumaFP)
        self.restaEvalModelo2 = float(cantidadModelo2TP * self.restaTP + cantidadModelo2TN * self.restaTN + cantidadModelo2FN * self.restaFN + cantidadModelo2FP * self.restaFP)


        # Costo Peor Caso
        
        peorCasoAciertosEnPositive = float(min(cantidadModelo2TP, self.probFNcuandoP * cantidadPositiveTestM2))
        peorCasoAciertosEnNegative = float(min(cantidadModelo2TN, self.probFPcuandoN * cantidadNegativeTestM2))
        
        self.peorCasoSistema = float((peorCasoAciertosEnPositive + min(self.probFNcuandoN * cantidadPositiveTestM2 - peorCasoAciertosEnPositive, cantidadModelo2FN)) * self.costoPositive + (peorCasoAciertosEnNegative + min(self.probFPcuandoP * cantidadNegativeTestM2 - peorCasoAciertosEnNegative, cantidadModelo2FP)) * self.costoNegative)




    def testModelo(self, cantidadPositiveTestM2, cantidadNegativeTestM2):
        
        # La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si clasificó erróneamente

        instanciasPositive = generateCorrelatedBernoulli(self.m1AccPositive, self.m2AccPositive, self.correlacionPositive, cantidadPositiveTestM2)
        instanciasNegative = generateCorrelatedBernoulli(self.m1AccNegative, self.m2AccNegative, self.correlacionNegative, cantidadNegativeTestM2)


        # Calcular confusiones Modelo 2

        cantidadModelo2TP = int(np.sum(instanciasPositive[:,1] == 1))
        cantidadModelo2TN = int(np.sum(instanciasNegative[:,1] == 1))
        cantidadModelo2FN = int(cantidadPositiveTestM2 - cantidadModelo2TP)
        cantidadModelo2FP = int(cantidadNegativeTestM2 - cantidadModelo2TN)


        # Correr fusionador
        # La función devuelve 1 si la instancia fue clasificada como clase Positive y 0 si fue clasificada como clase Negative

        function_name = self.tipoFusionador+"FusionadorAciertoInstancias"

        if hasattr(fusionadores, function_name):
            func = getattr(fusionadores, function_name)
            if callable(func):
                [instanciasSistemaPositive, instanciasSistemaNegative] = func(instanciasPositive, instanciasNegative)
            else:
                raise Exception("Error inesperado!!!")
        else:
            raise Exception("Fusionador no soportado. Usar 'or' o 'and'.")


        # Calcular confusiones Sistema

        cantidadSistemaTP = int(np.sum(instanciasSistemaPositive == 1))
        cantidadSistemaTN = int(np.sum(instanciasSistemaNegative == 0))
        cantidadSistemaFN = int(cantidadPositiveTestM2 - cantidadSistemaTP)
        cantidadSistemaFP = int(cantidadNegativeTestM2 - cantidadSistemaTN)
        

        # Evaluación del sistema

        self.evalSistema = float(cantidadSistemaFN * self.costoPositive + cantidadSistemaFP * self.costoNegative)


        # Evaluación modelo 2

        self.sumaEvalModelo2 = float(cantidadModelo2TP * self.sumaTP + cantidadModelo2TN * self.sumaTN + cantidadModelo2FN * self.sumaFN + cantidadModelo2FP * self.sumaFP)
        self.restaEvalModelo2 = float(cantidadModelo2TP * self.restaTP + cantidadModelo2TN * self.restaTN + cantidadModelo2FN * self.restaFN + cantidadModelo2FP * self.restaFP)


        # Costo Peor Caso

        peorCasoAciertosEnPositive = float(min(cantidadModelo2TP, self.probFNcuandoP * cantidadPositiveTestM2))
        peorCasoAciertosEnNegative = float(min(cantidadModelo2TN, self.probFPcuandoN * cantidadNegativeTestM2))
        
        self.peorCasoSistema = float((peorCasoAciertosEnPositive + min(self.probFNcuandoN * cantidadPositiveTestM2 - peorCasoAciertosEnPositive, cantidadModelo2FN)) * self.costoPositive + (peorCasoAciertosEnNegative + min(self.probFPcuandoP * cantidadNegativeTestM2 - peorCasoAciertosEnNegative, cantidadModelo2FP)) * self.costoNegative)