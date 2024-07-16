const generateBtn = document.querySelector("#btn");
const qr=document.querySelector(".generate");
const inputs = document.querySelectorAll("input"),
button = document.querySelector("#verify"),
expire = document.getElementById("expire");

generateBtn.addEventListener("click",()=>{
    qr.style.display="flex";
})

inputs.forEach((input, index)=>{
	input.addEventListener("keyup", function(e){
		const currentinput = input,
		nextInput = input.nextElementSibling,
		prevInput = input.previousElementSibling;

		if(nextInput && nextInput.hasAttribute("disabled") && currentinput.value!==""){
			nextInput.removeAttribute("disabled", true);
			nextInput.focus();
		}

		if(e.key === "Backspace"){
			inputs.forEach((input, index1)=>{
				if(index<=index1 && prevInput){
					input.setAttribute("disabled", true);
					prevInput.focus();
					prevInput.value = "";
				}
			})
		}

		if(inputs[3].disabled && inputs[3].value !== ""){
			inputs[3].blur();
			button.classList.add("active");
			return;
		}
		button.classList.remove("active");
	});
});

button.addEventListener("click",()=>{
	let verify="";
	inputs.forEach((input) => {
		verify +=input.value;
	});
	if(verify === OTP){
		alert("Correct");
		clearOTPs();
	}
	else{
		alert("Incorrect");
	}
});