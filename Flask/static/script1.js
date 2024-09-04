const generateBtn=document.querySelector("#btn");
const qr=document.querySelector(".qr");
const remBtn=document.querySelector(".remBtn");
const random=document.querySelector(".random")

// generateBtn.addEventListener("click",()=>{
//     qr.style.display="flex";
//     showOtp();
//     scroll();
// })
// remBtn.addEventListener("click",()=>{
//     qr.style.display="none";
// })

// function showOtp(){
//     otp=Math.ceil(Math.random()*10000);
//     random.innerText=otp;
//     console.log(otp);
// }

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('btn');
    
    btn.addEventListener('click', function() {
        qr.style.display="flex";
        showOtp();
        scroll();
        fetch('/generate_qr', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            
            qrImage.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    });
});

remBtn.addEventListener("click",()=>{
    qr.style.display="none";
})

function showOtp(){
    otp=Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10);
    otp=Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10);
    random.innerText=otp;
    console.log(otp);

    expire.innerText = 10;
    expireInterval = setInterval(function(){
        expire.innerText--;
        if(expire.innerText == 0){
            clearInterval(expireInterval);
            random.innerText="";
            qr.style.display="none";
        }
    },1000);
}