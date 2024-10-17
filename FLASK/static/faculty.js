const generateBtn = document.querySelector("#btn");
const qr = document.querySelector(".qr");
const remBtn = document.querySelector(".remBtn");
const random = document.querySelector(".random");
const Image = document.getElementsByClassName('image'); // Get the QR image element
const subjectName=document.getElementById("subjectName");
const date=document.getElementById("date");
const qrImage=document.getElementById("qrImage");
let flag=true;

// document.addEventListener('DOMContentLoaded', function() {
    generateBtn.addEventListener('click', function() {
        // Show the QR section and OTP
        qr.style.display = "flex";
        showOtp();
        flag=true;
        generateQr(subjectName.value+date.value);

        scroll();

        // Fetch the generated QR code from the backend
    //     fetch('/generate_qr', {
    //         method: 'POST',
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         // Set the src of the QR image to the base64 data
    //         qrImage.src = data.img_data;
    //         qrImage.style.display = 'block';
    //     })
    //     .catch(error => console.error('Error:', error));
    // });
});


remBtn.addEventListener("click", () => {
    // Hide the QR section when the remove button is clicked
    qr.style.display = "none";
    qrImage.src = ""; // Clear the QR image source
});

function showOtp() {
    // Generate a 4-digit random OTP
    otp = Math.floor(Math.random() * 10) + "" +
          Math.floor(Math.random() * 10) + "" +
          Math.floor(Math.random() * 10) + "" +
          Math.floor(Math.random() * 10);

    random.innerText = otp; // Set the OTP text
    console.log(otp);

    expire.innerText = 10;
    expireInterval = setInterval(function(){
        expire.innerText--;
        if(expire.innerText == 0){
            clearInterval(expireInterval);
            random.innerText="";
            qr.style.display="none";
            flag=false;
        }
    },1000);
}


function generateQr(code_Data){
    console.log(code_Data);

    
    if(code_Data.length>0){
        sendQrDataToServer(code_Data);
    qrImage.src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+code_Data;
    // imgBox.classList.add("show-img");
    }
    else
    {
        code_Data.classList.add('error');
        setTimeout(()=>{
            code_Data.classList.remove('error');
        },1000);
    }
}

function sendQrDataToServer(code_Data) {
    
    
    fetch('/qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code_Data})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error); 
    });
}
