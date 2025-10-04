export function generateCorrelatedBernoulli(p, q, rho, n){
    // La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente
    
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




export function computeJointBernoulliProbabilities(p, q, rho) {
    // La función devuelve 1 si la instancia acertó para la clase a la que pertenecía y 0 si predijo erróneamente

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