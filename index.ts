interface isValidOutput{
    passes : boolean,
    message : string
}

interface Operator{
    id : number,
    evaluate : Function,
    isValidInput : Function
}

interface UnaryOperator extends Operator{
    id : number,
    evaluate : (num: number) => number,
    isValidInput : (num: number) => isValidOutput
}

interface pendingUnaryObject{
    operator : string,
    bracesNum : number
}
interface BinaryOperator extends Operator{
    id : number,
    evaluate : (num1 : number, num2 : number) => number,
    isValidInput : (num1 : number, num2 : number) => isValidOutput
}
interface OperatorsObject{
    [key : string] : Operator
}
interface UnaryOperatorsObject extends OperatorsObject{
    [key : string] : UnaryOperator
}

interface BinaryOperatorsObject extends OperatorsObject{
    [key : string] : BinaryOperator
}

interface StackElement{
    isOperator : boolean,
    isBracket : boolean,
    value : number
}


function factorial(number : number) : number {
    let result = 1;

    for (let i = 2; i <= number; i++) {
        result = result * i;
    }

    return result;
}

let binaryOperations : BinaryOperatorsObject = 
{
    "^" : {
        "id" : 0,
        "evaluate" : (num1 : number, num2 : number) : number => Math.pow(num1, num2),
        "isValidInput" : (num1 : number, num2 : number) : isValidOutput => {
            return {
                "passes" : true,
                "message" : ""
            }
        }
    },
    "/" : {
        "id" : 1,
        "evaluate" : (num1 : number, num2 : number) : number=> num1 / num2,
        "isValidInput" : (num1 : number, num2 : number) : isValidOutput=> {
            if(num2 == 0){
                return {
                    "passes" : false,
                    "message" : "You can't divide by 0"
                }
            }

            return {
                "passes" : true,
                "message" : ""
            }
        }
    }, 
    "*" : {
        "id" : 2,
        "evaluate" : (num1 : number, num2 : number) => num1 * num2,
        "isValidInput" : (num1 : number, num2 : number) : isValidOutput=> {
            return {
                "passes" : true,
                "message" : ""
            }
        }
    }, 
    "+" : {
        "id" : 3,
        "evaluate" : (num1 : number, num2 : number) => num1 + num2,
        "isValidInput" : (num1 : number, num2 : number) : isValidOutput=> {
            return {
                "passes" : true,
                "message" : ""
            }
        }
    }, 
    "-" : {
        "id" : 4,
        "evaluate" : (num1 : number, num2 : number) => num1 - num2,
        "isValidInput" : (num1 : number, num2 : number) : isValidOutput=> {
            return {
                "passes" : true,
                "message" : ""
            }
        }
    }
};


let unaryOperators : UnaryOperatorsObject = {
    "ln" : {
        "id" : 5,
        "evaluate" : (num : number) : number => Math.log(num),
        "isValidInput" : (num : number) : isValidOutput=> {

            if(num <= 0){
                return {
                    "passes" : false,
                    "message" : "You can't take a log of a number less than or equal to 0."
                }
            }

            return {
                "passes" : true,
                "message" : ""
            }
        } 
    }, 
    "sqrt" : {
        "id" : 6,
        "evaluate" : (num : number) : number => Math.sqrt(num),
        "isValidInput" : (num : number) : isValidOutput=> {

            if(num < 0){
                return {
                    "passes" : false,
                    "message" : "You can't take a square root of a number less than 0."
                }
            }

            return {
                "passes" : true,
                "message" : ""
            }
        } 
    }, 
    "-" : {
        "id" : 7,
        "evaluate" : (num : number) : number => (num*-1),
        "isValidInput" : (num : number) : isValidOutput=> {
            return {
                "passes" : true,
                "message" : ""
            }
        } 
    },
    "+" : {
        "id" : 8,
        "evaluate" : (num : number) : number => (num*-1),
        "isValidInput" : (num : number) : isValidOutput=> {
            return {
                "passes" : true,
                "message" : ""
            }
        } 
    },
};
let postUnaryOperators : UnaryOperatorsObject = {
    "!" : {
        "id" : 9,
        "evaluate" : (num : number) => factorial(num),
        "isValidInput" : (num : number) => {

            // Checking if the number is negative
            // or not an integer
            if(num%1 != 0 || num < 0){
                return {
                    "passes" : false,
                    "message" : "You can't take a factorial of a " + (num%1 != 0 ? "non-integer" : "negative number")
                }
            }

            return {
                "passes" : true,
                "message" : ""
            }
        } 
    }
};

const mapOperatorToId : {[key : string] : number} = {}
const allOperators : Array<OperatorsObject> = [unaryOperators, postUnaryOperators, binaryOperations]; 
const operatorIDs = [];
for(let i = 0; i < allOperators.length; i++){
    let currentOperatorsObject = allOperators[i];
    for(let operator in currentOperatorsObject){
        let id = currentOperatorsObject[operator].id;

        if(operatorIDs.includes(id)){
            throw new Error(`ID ${id} has been used more than once.`);
        }
        else{
            operatorIDs.push(id);
            mapOperatorToId[operator] = id;
        }
    }
}

function evaluateBinaryExpression(num1 : number, num2 : number, operation : string){

    let canEvaluate = binaryOperations[operation].isValidInput(num1, num2);

    if(canEvaluate.passes){
        return binaryOperations[operation].evaluate(num1, num2);
    }else{
        throw new Error(canEvaluate.message);
    }
}

function evaluateUnaryExpression(num : number, operation : string){
    let canEvaluate = unaryOperators[operation].isValidInput(num);

    if(canEvaluate.passes){
        return unaryOperators[operation].evaluate(num);
    }else{
        throw new Error(canEvaluate.message);
    }
}

function evaluatePostUnaryExpression(num : number, operation : string){
    let canEvaluate = postUnaryOperators[operation].isValidInput(num);

    if(canEvaluate.passes){
        return postUnaryOperators[operation].evaluate(num);
    }else{
        throw new Error(canEvaluate.message);
    }
}

/**
 * Checks if a stack element represents a number
 * @param elem the element that needs to be checked
 * @returns true if does represent a number; false otherwise.
 */
function isNum(elem : StackElement){
    if(!elem){
        return false;
    }
    return elem.isBracket === false && elem.isOperator === false;
}

/**
 * Evaluates a subexpression. 
 * Subexpression in this context means an expression that does not
 * have any braces and consists only of binary operations.
 * For example: 
 * 5 + 4 * 30 / 4 -- is a sub expression
 * However, 5 + 4 * (30 / 4) and 5! + 4 * 30 / 4 are not 
 * sub expressions
 * @param exp the expression that needs to be evaluated
 * @returns a single numerical stack element 
 */
function evaluateSubExpression(exp : Array<StackElement>) : StackElement{

    for(let operator in binaryOperations){
        let operationID = mapOperatorToId[operator];

        // Evaluating the expression from left-right, following the
        // BODMAS convention
        for (let i = 0; i < exp.length; i++) {

            if(exp[i].isOperator && (exp[i].value == operationID)){

                // If the operator next to the current operator is a
                // unary minus sign, then we have to evaulate it right
                // now 
                if (exp[i + 1].value == -1 && exp[i + 1].isOperator) {
                    if (!isNum(exp[i + 2])) {
                        throw new Error("Syntax Error - 1");
                    }
                    exp[i + 2].value *= -1;
                    exp[i + 1] = exp[i + 2];
                    exp.splice(i + 2, 1);
                }

                // If the elements surrounding the operator are not
                // numbers, then it means that there is
                // a syntax error somewhere

                if(!isNum(exp[i - 1]) || !isNum(exp[i + 1]))
                {
                    throw new Error("Syntax Error");
                }
                let num1 = exp[i - 1].value;
                let num2 = exp[i + 1].value;

                exp[i - 1].value = evaluateBinaryExpression(num1, num2, operator); 
                exp.splice(i,2);
                i--;
            }
        }
    }


    // Evaluating all the remaining unary minus signs
    for (var i = 0; i < exp.length; i++) {
        if (exp[i].value == -1 && exp[i].isOperator) {
            if (!isNum(exp[i + 1])) {
                throw new Error("Syntax Error");
            }
            exp[i + 1].value *= -1;
            exp[i] = exp[i + 1];
            exp.splice(i + 1, 1);
        }
    }

    return {
        isOperator : false,
        isBracket : false,
        value: exp[0].value
    };
}

function evaluateExpression(exp: string) : number{
    let stack : Array<StackElement> = [];

    let numberOfUnclosedBrackets = 0;
    exp = exp.replaceAll(" ", "");
    exp = "(" + exp + ")";

    let number = 0;
    let decimalNumber = "";
    let firstNumber = true;
    let decimalFirst = true;
    let decimalStart = false;
    let pendingUnary : Array<pendingUnaryObject> = [];

    let isMinusUnary = false;
    let isMinusForNumber = true;
    let minusCoef = -1;
    let haveToUseCoef = false;
    let isPlusUnary = false;

    var isMinusPlusChain = false;

    for(let i = 0; i < exp.length; i++){
        let current = exp[i];

        let isNumber = !isNaN(parseInt(current));
        
        let didAdd = false;

        // Checking if the character is a number 
        if(isNumber || current == "."){
            didAdd = true;

            if (isMinusForNumber) {
                haveToUseCoef = true;
            }

            let currentNumber = parseInt(current);

            // Assigning the digit if it is the
            // the first digit of the number 
            if(firstNumber){
                number = currentNumber;
                firstNumber = false;
            }else{

                // Checking if it has decimal places
                if(current == "."){
                    decimalStart = true;
                }else if(decimalStart){

                    // Calculating the decimal part of the 
                    // number as an integer
                    if(decimalFirst){
                        decimalNumber = currentNumber.toString();
                        decimalFirst = false;
                    }else{
                        decimalNumber = decimalNumber + currentNumber;
                    }
                }else{

                    // Parsing the string as an Integer
                    number = number*10 + currentNumber;
                }
            }
        }else if(firstNumber == false){

            if (haveToUseCoef) {
                number = number * minusCoef;
            }


            // If the last item added to the stack was 
            // a bracket, then we can assume that this number has 
            // to be multiplied by the expression that 
            // is preceded by this bracket
            if(stack.length && isNum(stack[stack.length - 1])){
                stack.push({
                    isOperator : true,
                    isBracket : false,
                    value: mapOperatorToId["*"]
                });
            }

            // Adding decimal places if needed
            if(decimalStart){
                number = number + (Math.sign(number) == 0 ? 1 : Math.sign(number)) * parseFloat(`0.${decimalNumber}`);
            }

            // Adding the number to the stack
            stack.push({
                isOperator : false,
                isBracket : false,
                value : number
            });


            // Resetting values
            minusCoef = -1;
            decimalNumber = "";
            firstNumber = true;
            decimalStart = false;
            decimalFirst = false;
            haveToUseCoef = false;

        }


        if(stack.length && isNum(stack[stack.length - 1])){

            let shouldContinue = false;
            // Applying unary operators that are there
            // after the number
            for(let operator in postUnaryOperators){
                if(exp.substring(i, i + operator.length) == operator){

                    didAdd = true;

                    let value = stack[stack.length - 1].value;
                    stack[stack.length - 1].value = evaluatePostUnaryExpression(value, operator);


                    i = i + operator.length - 1;
                    shouldContinue = true;

                    break;
                }
            }
            if(shouldContinue) continue;
        }

        // - (minus) can behave like a unary AND a binary operator
        // For example:
        // 5 - 6 : - is a binary operator here
        // -(3)  : - is a unary operator here
        // Even when it is a unary operator, it can have two distinct behaviours:
        // unary operator performed on a particular number : -5
        if (stack.length &&
            (stack[stack.length - 1].isBracket || stack[stack.length - 1].isOperator) &&
            (current == "-" || current == "+")) {

            didAdd = true;
            if (exp[i + 1] == "-" || exp[i + 1] == "+") {

                if(isMinusPlusChain){
                    minusCoef *= (current == "-") ? -1 : 1;
                }else{
                    minusCoef = (current == "-") ? -1 : 1;
                }
                
                isMinusPlusChain = true;
                isMinusUnary = false;
                isMinusForNumber = false;
                continue;
            }
            else if(exp[i + 1] == "("){
                // If the next characted is a bracket
                // we can assume that the unary operator 
                // is being performed on an expression 
                if(isMinusPlusChain){
                    minusCoef *= (current == "-") ? -1 : 1;
                }else{
                    minusCoef = (current == "-") ? -1 : 1;
                }

                isMinusUnary = true;
                isMinusForNumber = false;
                isMinusPlusChain = false;
                // continue;
            }
            else{
                // If the next characted is a bracket
                // we can assume that the unary operator 
                // is being performed on an expression

                if(isMinusPlusChain){
                    minusCoef *= (current == "-") ? -1 : 1;
                }else{
                    minusCoef = (current == "-") ? -1 : 1;
                }

                isMinusUnary = false;
                isMinusForNumber = true;
                isMinusPlusChain = false;

                continue;
            }            
        }
        else {
            isMinusPlusChain = false;
            isMinusUnary = false;
            isMinusForNumber = false;
        }


        if(current == "("){

            // Incrementing the number of unclosed brackets
            numberOfUnclosedBrackets++;

            // If the last item added to the stack was 
            // a number, then we can assume that it has 
            // to be multiplied by the expression that 
            // is followed by this bracked
            if(stack.length && isNum(stack[stack.length - 1])){
                stack.push({
                    isOperator : true,
                    isBracket : false,
                    value: mapOperatorToId["*"]
                });
            }

            stack.push({
                isOperator : false,
                isBracket : true,
                value: 0
            });

        }else if(current == ")" || i == (exp.length - 1)){

            // Decrementing the number of unclosed brackets
            numberOfUnclosedBrackets--;

            stack.push({
                isOperator : false,
                isBracket : true,
                value: 1
            });
            
            // Now we can evaluate the expression that is enclosed
            // by the brackets
            let subExpression : Array<StackElement> = [];
            let lastChar : StackElement;

            // Adding the items that need to be evaluated
            do{                    
                lastChar = stack.pop()!;
                if(!lastChar.isBracket){
                    subExpression.unshift(lastChar);                    
                }

                // Breaking the look if we encounter an 
                // opening bracket
                if(lastChar.isBracket && lastChar.value == 0){
                    break;
                }

            } while(stack.length > 0);


            if(subExpression.length == 0){
                throw new Error("Syntax Error");
            }

            // Evaluating all the binary operations         
            stack.push(evaluateSubExpression(subExpression));

            
            // Evaluating all the non-post unary operations (like sqrt)
            if(pendingUnary.length != 0 && pendingUnary[pendingUnary.length - 1].bracesNum == numberOfUnclosedBrackets){
                
                if(!isNum(stack[stack.length - 1])){
                    throw new Error("Syntax Error");
                }

                stack[stack.length - 1] = {
                    isBracket : false,
                    isOperator : false,
                    value : evaluateUnaryExpression(stack[stack.length - 1].value, pendingUnary[pendingUnary.length - 1].operator) 
                }
                pendingUnary.pop();
            }

        }else {

            if(!isMinusUnary && !isPlusUnary){
                // Adding the binary operators to an array
                for(let operator in binaryOperations){

                    // Checking if the operator has been found in the string
                    if(exp.substring(i, i + operator.length) == operator){
                        didAdd = true;
                        i = i + operator.length - 1;

                        if(operator == "-"){
                            stack.push({
                                isBracket: false,
                                isOperator: true,
                                value: mapOperatorToId["+"]
                            });

                            stack.push({
                                isBracket: false,
                                isOperator: false,
                                value: -1
                            });

                            stack.push({
                                isBracket: false,
                                isOperator: true,
                                value: mapOperatorToId["*"]
                            });

                        }else{
                            stack.push({
                                isBracket: false,
                                isOperator: true,
                                value: mapOperatorToId[operator]
                            });
                        }
                        break;
                    }
                }
            }

            // Adding the unary operators to an array
            for(let operator in unaryOperators){

                // If the minus is binary, we don't want
                // to add it to the list
                if(operator == "-" && !isMinusUnary){
                    continue;
                } else if(operator == "-"){
                    if(minusCoef == 1){
                        break;
                    }
                }

                // Plus does't have any effect on
                // a number as a unary operator
                // so we can ignore it
                if(operator == "+"){
                    break;
                }


                // Checking if the operator has been found in the string
                if(exp.substring(i, i + operator.length) == operator){
                    didAdd = true;
                    i = i + operator.length - 1;

                    if(operator == "-"){

                        // Special operator reserved for internal
                        // use only. It signifies that the value has
                        // to be negated
                        stack.push({
                            isBracket: false,
                            isOperator: true,
                            value: -1
                        });
                    }else{
                        pendingUnary.push({
                            operator,
                            bracesNum : numberOfUnclosedBrackets
                        });
                    }
                    break;
                }
            }

            if(!didAdd){
                throw Error("Illegal characters or syntax error");
            }
        }

    }

    if(numberOfUnclosedBrackets != 0){
        throw new Error("Unbalanced brackets");
    }

    let value = evaluateSubExpression(stack).value;
    return value;
}
