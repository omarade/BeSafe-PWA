

var timeleft = 20;
    var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("countdown").textContent = timeleft;
    if(timeleft == 0)
        clearInterval(downloadTimer);
    },1000);


