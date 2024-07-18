const generateBtn = document.querySelector("#btn");
const qrContainer = document.querySelector(".qr-container");
const inputs = document.querySelectorAll("input");
const button = document.querySelector(".verify");
const generate = document.querySelector(".generate");

generateBtn.addEventListener("click", () => {
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

function startScanner() {
    console.log('Starting scanner...');
    const html5QrCode = new Html5Qrcode("qr-reader");

    function onScanSuccess(qrCodeMessage) {
        // Handle the scanned QR code data
        console.log(`QR Code detected: ${qrCodeMessage}`);
        sendQrDataToServer(qrCodeMessage);
        
        // Clear the scanner
        html5QrCode.clear().then(_ => {
            console.log("QR Code scanner cleared.");
            qrContainer.style.display = "none";
        }).catch(error => {
            console.error("Unable to clear QR Code scanner. Error: ", error);
        });
    }

    function onScanFailure(error) {
        // Handle scan failure, usually better to ignore and keep scanning
        console.warn(`QR Code scan error: ${error}`);
    }

    html5QrCode.start(
        { facingMode: "environment" }, // camera facing mode
        {
            fps: 10,    // frames per second
            qrbox: 250  // QR scanning box size
        },
        onScanSuccess,
        onScanFailure
    ).catch(error => {
        console.error("Unable to start scanning. Error: ", error);
    });
}

function sendQrDataToServer(qrData) {
    console.log('Sending QR data to server:', qrData);
    fetch('/scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrData: qrData })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
