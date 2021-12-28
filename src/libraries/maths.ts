export const reduce = (numerator: number, denominator: number): [number,number] => {

    var gcd = function gcd(a: number, b: number): number {
      return b ? gcd(b, a%b) : a;
    };

    const greatestcd = gcd(numerator,denominator);

    return [numerator/greatestcd, denominator/greatestcd];
}
export const reducestr = (numerator: string, denominator: string): string => {

    console.log("reduce:", numerator, denominator);

    const [n,d] = reduce(parseInt(numerator),parseInt(denominator));
    console.log(`${numerator}/${denominator} => ${n}/${d}`);

    if(denominator == "1")
    {
        console.log(`${numerator}/${denominator} => ${n}`);
        return numerator;
    }

    return `${n}/${d}`;
}

export const Init = () => {
    
//@ts-ignore
window.Math.reduce = reduce;
//@ts-ignore
window.Math.reducestr = reducestr;

console.log("math lib initialized");

}


export default Init;
