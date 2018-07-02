// Recursive color swaping (almost same as Tower of Hanoi)
// Recording can be better if make it just a return 
const makeAllWite = (record, vitaminsLine, source, target, buf, max, min = 3) => {
    if (min <= max) {
        makeAllWite(record, vitaminsLine, source, buf, target, max, min + 1)
        
        record(`Vitamin ${min} from ${vitaminsLine[min - 3].bg} to ${target}`)
        vitaminsLine[min - 3].bg = target

        makeAllWite(record, vitaminsLine, buf, target, source, max, min + 1)
    }
}

/*
    Algoritm description:
        1. Get info about max vitamin
        2. Find vitamin of different color from max vitamin and with biggest side (let's named it X)
        If we got X:
            2.1 Than all vitamins from X + 1 to max vitamin will go to X color
            2.1 Return to step 1
        3. All witamins go to wite color
*/
export const initMakeAllWite = (vitaminsLine, record) => {
    const
        length = vitaminsLine.length,
        max = length + 2,
        maxBg = vitaminsLine[length - 1].bg
        
    let next = null

    for (let i = length - 1; i > -1; i--) {
        if(vitaminsLine[i].bg !== maxBg) {
            next = vitaminsLine[i]
            break
        }
    }

    if (next) {
        const buf = ['W', 'B', 'G'].filter(bg => bg !== maxBg && bg !== next.bg)[0]
        makeAllWite(record, vitaminsLine, maxBg, next.bg, buf, max, next.sides + 1)
        initMakeAllWite(vitaminsLine, record)
    } else {
        const buf = ['W', 'B', 'G'].filter(bg => bg !== maxBg && bg !== 'W')[0]
        makeAllWite(record, vitaminsLine, maxBg, 'W', buf, max, 3)
    }
}

// Compare 2 lines of vitamins and return changed vitamin or error
export const checkVitaminColorSwap = (lineA = [], lineB = []) => {
    if (lineA.length !== lineB.length) 
        return {
            error: true,
            errorMessage: 'Vitamins lines with different length.'
        }

    const {changedVitamin, ...checkedDelta} = checkDelta(lineA, lineB)
    
    if (checkedDelta.error) return {...checkedDelta}

    const 
        maxLineA = findMaxs(lineA),
        maxLineB = findMaxs(lineB)

    if (maxLineA[changedVitamin.from] && maxLineA[changedVitamin.from] !== changedVitamin.sides)
        return {
            error: true,
            errorMessage: `Vitamin is not maxi in line ${changedVitamin.from}.`
        }
    
    if (maxLineB[changedVitamin.to] && maxLineB[changedVitamin.to] !== changedVitamin.sides)
        return {
            error: true,
            errorMessage: `Vitamin will become not maxi in line ${changedVitamin.from}.`
        }
     
    return {
        ...checkedDelta,
        changedVitamin
    }
}

// Check how much changed vitamin line
// Basicly we need to check changing of more than 1 vitamin
const checkDelta = (lineA, lineB) => {
    let 
        deltaCounter = 0,
        changedVitamin = 0

    for (let i = 0; i < lineA.length; i++) {
        if (lineA[i].bg !== lineB[i].bg) {
            deltaCounter++
            changedVitamin = {
                position: i,
                sides: lineA[i].sides,
                from: lineA[i].bg,
                to: lineB[i].bg
            }
        }
    }

    if (deltaCounter === 0) 
        return {
            error: true,
            errorMessage: 'Lines are same.'
        }

    if (deltaCounter > 1) 
        return {
            error: true,
            errorMessage: 'Changed more than 1 vitamin.'
        }

    return {
        error: false,
        changedVitamin
    }
}

// Find all Maxi vitamins for each color
const findMaxs = (line) => {
    let 
        wMax = 0,
        gMax = 0,
        bMax = 0

    line.forEach( vitamin => {
        const sides = vitamin.sides
        switch (vitamin.bg) {
            case 'W':
                if (wMax < sides) wMax = sides
                break;
            case 'G':
                if (gMax < sides) gMax = sides
                break;
            case 'B':
                if(bMax < sides) bMax = sides 
                break;
        }
    })

    return {
        W: wMax,
        G: gMax,
        B: bMax
    }
}