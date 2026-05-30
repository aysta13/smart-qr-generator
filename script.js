const qrText = document.getElementById("qrText");
const qrImage = document.getElementById("qrImage");
const downloadBtn = document.getElementById("downloadBtn");
const historyList = document.getElementById("historyList");

function generateQR() {

    const text = qrText.value.trim();

    if (text === "") {
        alert("Masukkan URL atau teks terlebih dahulu!");
        return;
    }

    const qrURL =
        "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
        encodeURIComponent(text);

    qrImage.src = qrURL;

    qrImage.onload = () => {

        qrImage.style.display = "block";

        downloadBtn.style.display = "block";

        saveHistory(text);
    };

    downloadBtn.onclick = async () => {

        const response = await fetch(qrURL);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code.png";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    };
}

function saveHistory(text){

    let history =
        JSON.parse(localStorage.getItem("qrHistory")) || [];

    if(!history.includes(text)){
        history.unshift(text);
    }

    history = history.slice(0,10);

    localStorage.setItem(
        "qrHistory",
        JSON.stringify(history)
    );

    renderHistory();
}

function renderHistory(){

    const history =
        JSON.parse(localStorage.getItem("qrHistory")) || [];

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        li.onclick = () => {
            qrText.value = item;
            generateQR();
        };

        historyList.appendChild(li);
    });
}

qrText.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        generateQR();
    }
});

renderHistory();