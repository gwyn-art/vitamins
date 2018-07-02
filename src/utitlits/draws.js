/*
    I don't have much of expirience in canvas drawing, 
    so code in some place can be confusing and not best one.
    I also think that making each polygon in different canvas will
    be better in way of managing them.
*/


const 
    radius = 100,
    startAngle = -Math.PI/2,
    leftOffset = 100,
    distanceBetween = 200,
    y = 120, // Vitamin horizontal center point
    fills = {
        W: 255,
        B: 0,
        G: 192
    },
    drawSpeed = 15,
    fillSpeed = 20

// Get vertices and points of vitamin
const getPath = (lineAngle, sides, isAnimated = true) => {
    const vertices = [{x: radius, y: 0}]

    for(let i = 1; i <= sides; i++) {
        vertices.push({x: radius*Math.cos(lineAngle*i), y: radius*Math.sin(lineAngle*i)}) 
    }
    
    return {
        vertices,
        waypoints: isAnimated ? calcWaypoints(vertices) : null
    }
}

const setup = (ctx, x) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(startAngle)
}

export function drawVitamins (ctx, vitamins) {
    const vitamin = vitamins.shift()
    if(!vitamin) return

    const 
        lineAngle = (Math.PI * 2)/vitamin.sides,
        {vertices, waypoints} = getPath(lineAngle, vitamin.sides),
        x = distanceBetween * (vitamin.sides - 3) + leftOffset

    setup(ctx, x)

    drawLines(
        ctx, 
        waypoints, 
        () => {
            fillVitamin({
                ctx, 
                x, 
                vertices, 
                newBg: fills[vitamin.bg],
                callback: () => drawVitamins(ctx, vitamins)})
    })
}

// Update vitamin by just changin it's color
export function updateVitamin ({ctx, sides, oldBg, newBg}) {
    const 
        lineAngle = (Math.PI * 2)/sides,
        {vertices} = getPath(lineAngle, sides),
        x = distanceBetween * (sides - 3) + leftOffset

    fillVitamin({ctx, x, vertices, oldBg: fills[oldBg], newBg: fills[newBg]}) 
}

// Draw lines with animation
function drawLines (ctx, points, callback, i = 1) {
    if (i < points.length-1) { 
        requestAnimationFrame(() => drawLines(ctx, points, callback, i+1)) 
    } else {
        ctx.closePath()
        ctx.restore()
        callback()
    }

    ctx.beginPath()
    ctx.moveTo(points[i-1].x,points[i-1].y)
    ctx.lineTo(points[i].x,points[i].y)
    ctx.stroke()

}

/*
    Anitmated filling vitamin with color.
    @NOTE:
        - Here we depend from equles of all rgb values on one step
        - We need to draw a polygon in different way from "drawLines"
          because path from "drawLines" is broken
        - Will be greate to separate filling from redrawing
          but just make filling in another function not working  
*/
function  fillVitamin ({ctx, x, vertices, newBg, callback = () => {}, oldBg = 255}) {
    const deltaBg = Math.abs(oldBg - newBg)
    if (deltaBg < 3) return callback()

    setup(ctx, x)
    ctx.beginPath()
    ctx.moveTo(vertices[0].x, vertices[0].y)

    vertices.forEach((point, i) => {
        ctx.lineTo(point.x, point.y)
    })

    ctx.closePath()
    ctx.stroke()
    ctx.restore()

    const 
        newColor = oldBg + (newBg >  oldBg ? deltaBg / fillSpeed + 1 : -1 * (deltaBg / fillSpeed) - 1)
    
    ctx.fillStyle = `rgb(${newColor}, ${newColor}, ${newColor})`
    ctx.fill()
    ctx.stroke()

    requestAnimationFrame(() => fillVitamin({ctx, x, vertices, newBg, callback, oldBg: newColor}))
}

// Splite line of plygon to small points for animation
function calcWaypoints(vertices) {
    let 
        waypoints=[], 
        lastpoint = vertices[vertices.length - 1]

    for(let i=1;i<vertices.length;i++){
        let pt0=vertices[i-1],
            pt1=vertices[i],
            dx=pt1.x-pt0.x,
            dy=pt1.y-pt0.y

        for(let j=0; j<=drawSpeed; j++){
            let 
                x=pt0.x+dx*j/drawSpeed,
                y=pt0.y+dy*j/drawSpeed

            waypoints.push({x:x,y:y})
        }
    }

    waypoints.push(lastpoint)
    return(waypoints);
}