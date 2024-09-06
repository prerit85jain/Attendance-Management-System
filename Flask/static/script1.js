const generateBtn = document.querySelector("#btn");
const qr = document.querySelector(".qr");
const remBtn = document.querySelector(".remBtn");
const random = document.querySelector(".random");
const qrImage = document.getElementById('qrImage'); // Get the QR image element
let flag=true;

document.addEventListener('DOMContentLoaded', function() {
    generateBtn.addEventListener('click', function() {
        // Show the QR section and OTP
        qr.style.display = "flex";
        showOtp();
        flag=true;
        scroll();

        // Fetch the generated QR code from the backend
        fetch('/generate_qr', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            // Set the src of the QR image to the base64 data
            qrImage.src = data.img_data;
            qrImage.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    });
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