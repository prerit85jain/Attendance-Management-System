const Btn = document.querySelector("#btn");
const qrContainer = document.querySelector(".qr-container");
const inputs = document.querySelectorAll("input");
const button = document.querySelector(".verify");
const generate = document.querySelector(".generate");
const student_name=document.getElementById("student_name")
const student_roll=document.getElementById("student_roll")
const marked=document.querySelector(".marked");

Btn.addEventListener("click", () => {
    qrContainer.style.display = "flex";
	generate.style.display = "flex";
    startScanner();
});

inputs.forEach((input, index) => {
    input.addEventListener("keyup", function (e) {
        const currentinput = input,
            nextInput = input.nextElementSibling,
            prevInput = input.previousElementSibling;

        if (nextInput && nextInput.hasAttribute("disabled") && currentinput.value !== "") {
            nextInput.removeAttribute("disabled", true);
            nextInput.focus();
        }

        if (e.key === "Backspace") {
            inputs.forEach((input, index1) => {
                if (index <= index1 && prevInput) {
                    input.setAttribute("disabled", true);
                    prevInput.focus();
                    prevInput.value = "";
                }
            });
        }

        if (inputs[3].disabled && inputs[3].value !== "") {
            inputs[3].blur();
            button.classList.add("active");
            return;
        }
        button.classList.remove("active");
    });
});

button.addEventListener("click", () => {
    let verify = "";
    inputs.forEach((input) => {
        verify += input.value;
    });
    if (verify === OTP) {
        alert("Correct");
        clearOTPs();
    } else {
        alert("Incorrect");
    }
});

let html5QrCode;
function startScanner() {
    console.log('Starting scanner...');
    html5QrCode = new Html5Qrcode("qr-reader");

    function onScanSuccess(qrCodeMessage) {
        stopScanner();
        console.log(`QR Code detected: ${qrCodeMessage}`);
        sendQrDataToServer(qrCodeMessage)

        html5QrCode.clear().then(() => {
            console.log("QR Code scanner cleared.");
            qrContainer.style.display = "none";
        }).catch(error => {
            console.error("Unable to clear QR Code scanner. Error: ", error);
        });
    }

    function onScanFailure(error) {
        console.warn(`QR Code scan error: ${error.message || error}`);
    }

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 15,
            qrbox: { width: 400, height: 400 }
        },
        onScanSuccess,
        onScanFailure
    ).catch(error => {
        console.error("Unable to start scanning. Error: ", error);
    });
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log("QR Code scanner stopped.");
            qrContainer.style.display = "none";
            marked.style.display="block";
            generate.style.display="none";
            Btn.style.backgroundColor = "#AAFF00";
            Btn.innerText="Marked";
            Btn.disabled=true;
            Btn.classList.add("no-hover");
        }).catch(error => {
            console.error("Error stopping QR Code scanner: ", error);
        });
    } else {
        console.log("No active QR code scanning session.");
    }
}

function sendQrDataToServer(qrCodeMessage) {
    let student_details = student_name.innerText+","+student_roll.innerText+","+qrCodeMessage;
    console.log('Sending QR data to server:', student_details);
    
    
    fetch('/scanStudent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({student_details:student_details})// Convert the qrData to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON from the response
    })
    .then(data => {
        console.log('Success:', data); // Log the success message from the server
    })
    .catch((error) => {
        console.error('Error:', error); // Catch and log errors
    });
}
    

function clearOTPs() {
    inputs.forEach(input => input.value = "");  
}
