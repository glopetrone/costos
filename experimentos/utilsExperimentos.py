import sistema
import numpy as np
import utils
from distribuciones import validBernoulliJointProbabilityWithCorrelation




def correrExperimentos(m1AccPositive=0.5, m1AccNegative=0.5, m2AccPositive=0.5, m2AccNegative=0.5, tipoFusionador='or',correlacionPositive=0, correlacionNegative=0, cantidadExperimentos = 10, cantidadElementosTestMin = 100, cantidadElementosTestMax = 1000, cantidadElementosTestCantidad = 10):
    
    # (cantidadesM1, cantidadesM2, tipoResultado, experimentos)
    resultadosTest = np.zeros((cantidadElementosTestCantidad, cantidadElementosTestCantidad, 4, cantidadExperimentos))

    for experimento in range(cantidadExperimentos):
        
        utils.progress_bar(experimento, cantidadExperimentos)

        for idxM1, cantidadM1 in enumerate(np.logspace(np.log10(cantidadElementosTestMin), np.log10(cantidadElementosTestMax), cantidadElementosTestCantidad).round().astype(int)):
            for idxM2, cantidadM2 in enumerate(np.logspace(np.log10(cantidadElementosTestMin), np.log10(cantidadElementosTestMax), cantidadElementosTestCantidad).round().astype(int)):

                sistemaEjemplo = sistema.Sistema(m1AccPositive=m1AccPositive, m1AccNegative=m1AccNegative, m2AccPositive=m2AccPositive, m2AccNegative=m2AccNegative, tipoFusionador=tipoFusionador,correlacionPositive=correlacionPositive, correlacionNegative=correlacionNegative)

                cantidadPositiveTestM1 = cantidadM1
                cantidadNegativeTestM1 = cantidadM1

                cantidadPositiveTestM2 = cantidadM2
                cantidadNegativeTestM2 = cantidadM2

                sistemaEjemplo.testSistema(cantidadPositiveTestM1=cantidadPositiveTestM1, cantidadNegativeTestM1=cantidadNegativeTestM1)
                sistemaEjemplo.testModelo(cantidadPositiveTestM2=cantidadPositiveTestM2, cantidadNegativeTestM2=cantidadNegativeTestM2)
                resultadosTest[idxM1, idxM2, :, experimento] += sistemaEjemplo.peorCasoSistema, sistemaEjemplo.evalSistema, sistemaEjemplo.sumaEvalModelo2, sistemaEjemplo.restaEvalModelo2
                
    utils.progress_bar(cantidadExperimentos, cantidadExperimentos)

    return resultadosTest




def correrEstimaciones(m1AccPositive=0.5, m1AccNegative=0.5, m2AccPositive=0.5, m2AccNegative=0.5, tipoFusionador='or',correlacionPositive=0, correlacionNegative=0, cantidadElementosTestMin = 100, cantidadElementosTestMax = 2000, cantidadElementosTestCantidad = 100):

    # (cantidadesM1, cantidadesM2, tipoResultado)
    resultadosEstimaciones = np.zeros((cantidadElementosTestCantidad, cantidadElementosTestCantidad, 4))

    for idxM1, cantidadM1 in enumerate(np.logspace(np.log10(cantidadElementosTestMin), np.log10(cantidadElementosTestMax), cantidadElementosTestCantidad).round().astype(int)):
        for idxM2, cantidadM2 in enumerate(np.logspace(np.log10(cantidadElementosTestMin), np.log10(cantidadElementosTestMax), cantidadElementosTestCantidad).round().astype(int)):


            sistemaEjemplo = sistema.Sistema(m1AccPositive=m1AccPositive, m1AccNegative=m1AccNegative, m2AccPositive=m2AccPositive, m2AccNegative=m2AccNegative, tipoFusionador=tipoFusionador,correlacionPositive=correlacionPositive, correlacionNegative=correlacionNegative)

            cantidadPositiveTestM2 = cantidadM2
            cantidadNegativeTestM2 = cantidadM2

            sistemaEjemplo.estimarSistema()
            sistemaEjemplo.estimarModelo(cantidadPositiveTestM2=cantidadPositiveTestM2, cantidadNegativeTestM2=cantidadNegativeTestM2)

            resultadosEstimaciones[idxM1, idxM2] += sistemaEjemplo.peorCasoSistema, sistemaEjemplo.evalSistema, sistemaEjemplo.sumaEvalModelo2, sistemaEjemplo.restaEvalModelo2

    return resultadosEstimaciones




def correrExperimentosModeloRandom(cantidadExperimentos = 10000, cantidadElementosTest = 10000):

    # (cantidadesM1, cantidadesM2, tipoResultado, experimentos)
    resultadosTest = np.zeros((4, cantidadExperimentos))

    for experimento in range(cantidadExperimentos):
        
        utils.progress_bar(experimento, cantidadExperimentos)


        sistemaEjemplo = generarSistemaRandom()

        cantidadPositiveTestM1 = cantidadElementosTest
        cantidadNegativeTestM1 = cantidadElementosTest
        cantidadPositiveTestM2 = cantidadElementosTest
        cantidadNegativeTestM2 = cantidadElementosTest

        sistemaEjemplo.testSistema(cantidadPositiveTestM1=cantidadPositiveTestM1, cantidadNegativeTestM1=cantidadNegativeTestM1)
        sistemaEjemplo.testModelo(cantidadPositiveTestM2=cantidadPositiveTestM2, cantidadNegativeTestM2=cantidadNegativeTestM2)

        resultadosTest[:, experimento] += sistemaEjemplo.peorCasoSistema, sistemaEjemplo.evalSistema, sistemaEjemplo.sumaEvalModelo2, sistemaEjemplo.restaEvalModelo2
                
    utils.progress_bar(cantidadExperimentos, cantidadExperimentos)

    return resultadosTest




def correrEstimacionesModeloRandom(cantidadElementosTest = 1000):

    # (cantidadesM1, cantidadesM2, tipoResultado)
    resultadosEstimaciones = np.zeros((4))

    cantidadPositiveTestM2 = cantidadElementosTest
    cantidadNegativeTestM2 = cantidadElementosTest

    sistemaEjemplo = generarSistemaRandom()
    
    sistemaEjemplo.estimarSistema()
    sistemaEjemplo.estimarModelo(cantidadPositiveTestM2=cantidadPositiveTestM2, cantidadNegativeTestM2=cantidadNegativeTestM2)
    resultadosEstimaciones += sistemaEjemplo.peorCasoSistema, sistemaEjemplo.evalSistema, sistemaEjemplo.sumaEvalModelo2, sistemaEjemplo.restaEvalModelo2

    return resultadosEstimaciones




def generarSistemaRandom():
    m1AccPositive = np.random.uniform()
    m1AccNegative = np.random.uniform()
    m2AccPositive = np.random.uniform()
    m2AccNegative = np.random.uniform()

    correlacionPositiveMin, correlacionPositiveMax = validBernoulliJointProbabilityWithCorrelation(m1AccPositive, m2AccPositive)
    correlacionNegativeMin, correlacionNegativeMax = validBernoulliJointProbabilityWithCorrelation(m1AccNegative, m2AccNegative)

    correlacionPositive = np.random.uniform(correlacionPositiveMin, correlacionPositiveMax)
    correlacionNegative = np.random.uniform(correlacionNegativeMin, correlacionNegativeMax)

    tipoFusionador = np.random.choice(['or', 'and'])

    sistemaRandom = sistema.Sistema(m1AccPositive=m1AccPositive, m1AccNegative=m1AccNegative, m2AccPositive=m2AccPositive, m2AccNegative=m2AccNegative, tipoFusionador=tipoFusionador,correlacionPositive=correlacionPositive, correlacionNegative=correlacionNegative)

    return sistemaRandom