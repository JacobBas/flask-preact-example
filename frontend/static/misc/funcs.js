/**
 * Takes in a float and the number of significant figures and returns the
 * corresponding float rounded to the specified significant figures
 *
 * @param {float} num a float number that wants to be rounded
 * @param {int} sig the number of significant figures to be returned
 * @returns a rounded number to the specified significance level
 */
export function sig_round(num, sig) {
    sig = 10 ** sig;
    return Math.round(num * sig) / sig;
}
