

let interval;
let check = Number(localStorage.getItem('total'))
let total = 00
if( check > 0){
    interval = setInterval(Timer, 1000);
}else{
    clearInterval(interval)
}
function totalValue(){
    let hour = Number(localStorage.getItem('hour'))
    let minute = Number(localStorage.getItem('minute'))
    let second =  Number(localStorage.getItem('second'))
    let total_count = hour * 3600 + minute * 60 + second
    localStorage.setItem('total',total_count );
    total = localStorage.getItem('total')
}
function Timer () {
    totalValue()
    total--;
    console.log("total" , total)
    localStorage.setItem('total', total)
    if (total >= 00) {
        var hr = Math.floor(total / 3600);
        var mt = Math.floor((total / 60) - (hr * 60));
        var sc = total - ((hr * 3600) + (mt * 60));

        localStorage.setItem('hour',  hr)
        localStorage.setItem('minute', mt)
        localStorage.setItem('second', sc)
        console.log("hour" , hr)
        console.log("minute" , mt)
        console.log("second" , sc)
    }
    else {

        let sound = new Audio('sound.mp3');
        sound.play();
        clearInterval(interval);
        alert('Time Over!!!')

    }
}