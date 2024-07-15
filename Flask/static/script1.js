const generateBtn=document.querySelector("#btn");
const qr=document.querySelector(".qr");
const remBtn=document.querySelector(".remBtn");
const random=document.querySelector(".random")

generateBtn.addEventListener("click",()=>{
    qr.style.display="flex";
    showOtp();
    scroll();
})
remBtn.addEventListener("click",()=>{
    qr.style.display="none";
})

function showOtp(){
    otp=Math.ceil(Math.random()*10000);
    random.innerText=otp;
    console.log(otp);
}




