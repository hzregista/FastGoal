const cvs= document.getElementById('thegoal')
const ctx = cvs.getContext('2d')
const drawRect = (x,y,w,h,color) => {
ctx.fillStyle = color
ctx.fillRect(x,y,w,h)
}

const drawCirclef = (x,y,r,color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x,y,r,0,2 * Math.PI,false)
    ctx.closePath()
    ctx.fill()
}

const drawCircles = (x,y,r,w,color) => {
    ctx.strokeStyle = color
    ctx.lineWidth= w
    ctx.beginPath()
    ctx.arc(x,y,r,0,2 * Math.PI)
    ctx.closePath()
    ctx.stroke()   
}

const drawText = (text,x,y,color)=>{
    ctx.fillStyle = color
    ctx.font = '50px sans-serif'
    ctx.fillText(text,x,y)
}

const ball = {
    x:cvs.width/2,
    y:cvs.height/2,
    r:13,
    color:'#000000',
    speed:5,
    velocityX:3,
    velocityY:4,
    stop:true
}

const player = {
    x:20,
    y:cvs.height/2-50,
    w:10,
    h:100,
    color: '#fff',
    score:0
}

const bot = {
    x:cvs.width-30,
    y:cvs.height/2-50,
    w:10,
    h:100,
    color: '#fff',
    score:0
}

const render = () => {
    drawRect(0,0,cvs.width,cvs.height,'#279b37')
    drawRect(cvs.width/2-2,0,4,cvs.height,'#fff')
    drawCirclef(cvs.width/2,cvs.height/2,8,'#fff')
    drawCircles(cvs.width/2,cvs.height/2,50,4,'#fff')
    drawText(player.score,cvs.width/4,100,'#fff')
    drawText(bot.score,3*cvs.width/4,100,'#fff')
    drawRect(player.x,player.y,player.w,player.h,player.color)
    drawRect(bot.x,bot.y,bot.w,bot.h,bot.color)
    drawCirclef(ball.x,ball.y,ball.r,ball.color)
}

const reset = () =>
{
    ball.x = cvs.width/2
    ball.y = cvs.height/2
    ball.speed = 5
    ball.velocityX = 3
    ball.velocityY = 4
    ball.stop = true
}
const refresh = () => {
    if (!ball.stop)
    {
        ball.x += ball.velocityX
        ball.y += ball.velocityY
    }
    ball.x += ball.velocityX
    ball.y += ball.velocityY
    if(ball.y+ball.r > cvs.height || ball.y - ball.r < 0)
        ball.velocityY = -ball.velocityY
    let botLvl = 0.25
    bot.y += (ball.y -(bot.y + bot.h/2)) * botLvl
    let direction = (ball.x <cvs.width/2) ? player:bot
    if(collision(ball,direction)){
        let intersectY = ball.y - (direction.y + direction.h/2)
        intersectY /= direction.h/2
        let maxBounceRate = Math.PI / 3
        let bounceAngla = intersectY + maxBounceRate 
        let balldirection = (ball.x<cvs.width/2) ? 1 : -1
        ball.velocityX = balldirection * ball.speed * Math.cos(bounceAngla)
        ball.velocityY = ball.speed * Math.sin(bounceAngla)
        ball.speed += 2
    }
    if (ball.x>cvs.width){
        player.score++
        reset()
    }else if (ball.x<0){
        bot.score++
        reset()
    }
}

const collision = (b,d) => {
    b.top = b.y - b.r
    d.top = d.y
    b.bottom = b.y + b.r
    d.bottom = d.y+d.h
    b.left = b.x - b.r
    d.left = d.x
    b.right = b.x + b.r
    d.right = d.x+d.w
    return (b.top<d.bottom && b.bottom>d.top&&b.left<d.right&&b.right>d.left)
}

const thegoal = () => {
    render()
    refresh()
}

const movePaddle = (e) =>{
    let rect = cvs.getBoundingClientRect()
    player.y = e.clientY - rect.top - player.h/2
}

cvs.addEventListener('mousemove',movePaddle)
const fps = 50
setInterval(thegoal,500/fps)