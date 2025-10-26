import numpy as np




def generateCorrelatedBernoulli(p, q, rho, n):
    # La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente
    
    jointProbabilities = computeJointBernoulliProbabilities(p, q, rho);

    # Generate n pairs of (X, Y)
    result = np.zeros((n,2))
    
    randomNumber = np.random.uniform(0,1,n)

    result[randomNumber <= jointProbabilities[0]] = [0,0]
    result[np.logical_and(randomNumber <= jointProbabilities[0] + jointProbabilities[1], randomNumber > jointProbabilities[0])] = [0,1]
    result[np.logical_and(randomNumber <= jointProbabilities[0] + jointProbabilities[1] + jointProbabilities[2], randomNumber > jointProbabilities[0] + jointProbabilities[1])] = [1,0]
    result[np.logical_and(randomNumber <= 1, randomNumber > jointProbabilities[0] + jointProbabilities[1] + jointProbabilities[2])] = [1,1]

    return result




def computeJointBernoulliProbabilities(p, q, rho):
    # La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente

    if (p < 0 or p > 1 or q < 0 or q > 1 or rho < -1 or rho > 1):
        raise Exception('Invalid inputs: p, q must be in [0,1], rho in [-1,1]')

    # Compute variance terms
    varX = p * (1 - p)
    varY = q * (1 - q)
    stdProd = np.sqrt(varX * varY)

    # Compute joint probability P(X=1, Y=1)
    p11 = p * q + rho * stdProd

    # Check if joint probability is valid
    minJoint = max(0, p + q - 1)
    maxJoint = min(p, q)
    if (p11 < minJoint or p11 > maxJoint):
        raise Exception(f'Invalid correlation: rho=${rho} is not achievable with p=${p}, q=${q}. ' +
                        f'P(1,1)=${p11} must be in [${minJoint}, ${maxJoint}]')

    # Compute other probabilities
    p10 = p - p11;  # P(X=1, Y=0)
    p01 = q - p11;  # P(X=0, Y=1)
    p00 = 1 - p - q + p11;  # P(X=0, Y=0)

    # Ensure all probabilities are non-negative (should be if constraints hold)
    if (p00 < 0 or p01 < 0 or p10 < 0 or p11 < 0):
        raise Exception('Computed probabilities include negative values; check inputs.')


    return [p00, p01, p10, p11]

def validBernoulliJointProbabilityWithCorrelation(p, q):
    varX = p * (1 - p)
    varY = q * (1 - q)
    stdProd = np.sqrt(varX * varY)
    
    minJoint = max(0, p + q - 1)
    maxJoint = min(p, q)

    correlationMin = (minJoint - p*q) / stdProd if stdProd != 0 else 0
    correlationMax = (maxJoint - p*q) / stdProd if stdProd != 0 else 0

    return [correlationMin, correlationMax]