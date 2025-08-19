class CanvasDraw {
    constructor(name) {
        this.name = name;
        this.canvas = document.getElementById("myCanvas");
        this.pen = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.nameList = [];
        this.scoreList = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        this.id = [];
        this.nameByScoreList = [];
        this.copyNameByScoreList = [];
        this.canvasPadding = 30;
        this.xBarStep = 0;
        this.yBarStep = 0;
        this.local = "https://chan3623.github.io/line_graph/";
        //this.kkms = "http://kkms4001.iptime.org:33050";
    }

    fetchData() {
        // AJAX 요청을 생성합니다.
        const xhr = new XMLHttpRequest();
        const url = `${this.local}/graphData`;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // JSON 데이터를 파싱하고 표시합니다.
                    const jsonData = JSON.parse(xhr.responseText);
                    this.displayData(jsonData);
                    this.methodCall();
                } else {
                    console.error('데이터를 불러오는 중 에러가 발생했습니다.');
                }
            }
        };
        // GET 요청을 보냅니다.
        xhr.open('GET', url);
        xhr.send();
    }
    displayData(data) {
        // 'items'라는 속성이 있는지 확인
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                this.nameList.push(item.person_name);
                this.nameByScoreList.push(parseInt(item.score));
                this.id.push(item.id);
            });
            // console.log(this.nameList, this.nameByScoreList);
            this.xBarStep = Math.floor(this.canvasWidth / (this.nameList.length + 2));
            this.yBarStep = Math.floor(this.canvasHeight / (this.scoreList.length + 2));
        } else {
            console.error('올바른 데이터 형식이 아닙니다.');
        }
    }
    //canvas에 보정한 값으로 그리기 메서드
    drawLine(color, x, y) {
        this.pen.fillStyle = color;
        this.pen.fillRect(x + this.canvasPadding - 0.5, this.canvasHeight + ((y + this.canvasPadding) * -
            1) -
            0.5, 1, 1);
    }
    drawColorLine(color, x, y) {
        this.pen.fillStyle = color;
        this.pen.font = "14px Noto Sans KR, sans-serif";
        this.pen.fillRect(x + this.canvasPadding, this.canvasHeight + ((y + this.canvasPadding) * -1), 1,
            1);
        this.pen.fillRect(x + this.canvasPadding, this.canvasHeight + ((y + this.canvasPadding) * -1), 1,
            -1);
    }
    drawText(color, text, x, y) {
        this.pen.fillStyle = color;
        this.pen.font = "14px Noto Sans KR, sans-serif";
        this.pen.textAlign = "center";
        this.pen.fillText(text, x + this.canvasPadding, this.canvasHeight + ((y + this.canvasPadding) * -
            1));
    }
    drawDot(color, x, y) {
        this.pen.fillStyle = color;
        this.pen.font = "14px Noto Sans KR, sans-serif";
        this.pen.fillRect(x + this.canvasPadding - 2.5, this.canvasHeight + ((y + this.canvasPadding) * -
            1) -
            2.5, 5, 5);
    }
    //x축 이름리스트 및 y축 스코어 기준표 그리는 함수
    xyLineText() {
        for (let i = 0; i < this.scoreList.length; i++) {
            this.drawText("#ffffff", this.scoreList[i], -20, (this.yBarStep * i) + this.yBarStep - 4);
        }
        for (let i = 0; i < this.nameList.length; i++) {
            this.drawText("#ffffff", this.nameList[i], (this.xBarStep * i) + this.xBarStep, -20);
        }
    }
    //x라인과 y라인 그리는 메서드
    xyLineCreate() {
        for (let i = 0; i < this.canvasWidth; i++) {
            this.drawLine("#ffffff", i, 0);
            this.drawLine("#ffffff", 0, i);
        }
        for (let i = this.yBarStep; i < this.canvasHeight; i = i + this.yBarStep) {
            for (let j = 0; j < this.canvasWidth; j = j + 10) {
                this.drawLine("#9BA4B5", j, i);
            }
        }
    }
    // 그래프 각도의 따라 점수 텍스트 위치 조정(위 또는 아래(가독성))
    xyTextCreate() {
        for (let i = 0; i < this.nameByScoreList.length; i++) {
            if (this.nameByScoreList[i] < this.nameByScoreList[i + 1]) {
                this.drawText("#98E4FF", this.nameByScoreList[i], (this.xBarStep * i) + this.xBarStep + 8,
                    this
                        .nameByScoreList[i] * (this.yBarStep / 10) + this.yBarStep - 15);
            } else if (i == this.nameByScoreList.length - 1) {
                if (this.nameByScoreList[i] > this.nameByScoreList[i - 1]) {
                    this.drawText("#98E4FF", this.nameByScoreList[i], (this.xBarStep * i) + this.xBarStep +
                        8,
                        this
                            .nameByScoreList[i] * (this.yBarStep / 10) + this.yBarStep + 15);
                } else {
                    this.drawText("#98E4FF", this.nameByScoreList[i], (this.xBarStep * i) + this.xBarStep +
                        8,
                        this
                            .nameByScoreList[i] * (this.yBarStep / 10) + this.yBarStep - 15)
                }
            } else {
                this.drawText("#98E4FF", this.nameByScoreList[i], (this.xBarStep * i) + this.xBarStep + 8,
                    this
                        .nameByScoreList[i] * (this.yBarStep / 10) + this.yBarStep + 15);
            }
        }
    }
    // 점수 점으로 더 두껍게 표시
    xyDot() {
        for (let i = 0; i < this.nameByScoreList.length; i++) {
            this.drawDot("#FF407D", this.xBarStep * (i + 1), this.yBarStep + this.nameByScoreList[i] * (this
                .yBarStep / 10));
        }
    }
    //점수와 점수 선처럼 이어주는 함수
    drawSlope() {
        // console.log(this.nameList)
        for (let i = 1; i < this.nameByScoreList.length; i++) {
            let ySlope = (this.nameByScoreList[i] * (this.yBarStep / 10)) - (this.nameByScoreList[i - 1] * (
                this.yBarStep / 10));
            let ySlope2 = ySlope / this.xBarStep;
            for (let j = 0; j < this.xBarStep; j = j + 0.1) {
                this.drawLine("#ffffff", ((this.xBarStep * (i - 1) + this.xBarStep) + j), ((this
                    .nameByScoreList[i - 1] * (
                        this.yBarStep / 10)) + (ySlope2 * j)) + this.yBarStep);
            }
        }
    }
    //bubbleSort 기법으로 배열 요소들 정렬하는 메서드
    bubbleSort() {
        this.copyNameByScoreList = [...this.nameByScoreList]
        for (let i = 0; i < this.copyNameByScoreList.length - 1; i++) {
            for (let j = 0; j < this.copyNameByScoreList.length; j++) {
                if (this.copyNameByScoreList[j] > this.copyNameByScoreList[j + 1]) {
                    let temp = this.copyNameByScoreList[j];
                    this.copyNameByScoreList[j] = this.copyNameByScoreList[j + 1];
                    this.copyNameByScoreList[j + 1] = temp;
                }
            }
        }
    }
    displayClear() {
        this.pen.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.xyLineText();
        this.xyLineCreate();
        this.xyTextCreate();
        this.drawSlope();
        this.xyDot();
    }
    //값 출력 함수
    valuePrint() {
        let averageValue = 0;
        let midValue = 0;
        let temp = 0;
        let countList = [];
        console.log(this.copyNameByScoreList);
        for (let i = 0; i < this.copyNameByScoreList.length; i++) {
            temp += this.copyNameByScoreList[i];
            //console.log(temp);
            if (this.copyNameByScoreList.length % 2 !== 0) {
                midValue = this.copyNameByScoreList[Math.floor(this.copyNameByScoreList.length / 2)];
            } else {
                midValue = (this.copyNameByScoreList[this.copyNameByScoreList.length / 2] + this
                    .copyNameByScoreList[this.copyNameByScoreList.length / 2 - 1]) / 2;
            }
        }
        averageValue = Math.floor((temp / this.copyNameByScoreList.length) * 100) / 100;
        for (let i = 0; i < this.copyNameByScoreList.length; i++) {
            let count = 0;
            for (let j = 0; j < this.copyNameByScoreList.length; j++) {
                if (this.copyNameByScoreList[i] === this.copyNameByScoreList[j]) {
                    count++;
                }
            }
            countList.push(count);
        }
        let modeValue = Math.max(...countList);
        let countList2 = [];
        for (let i = 0; i < countList.length; i++) {
            if (modeValue === countList[i]) {
                countList2.push(parseInt(this.copyNameByScoreList[i]))
            }
        }
        for (let i = 0; i < countList2.length; i++) {
            for (let j = 0; j < countList2.length; j++) {
                if (i !== j && countList2[i] === countList2[j]) {
                    countList2.splice(j, 1);
                }
            }
        }
        document.getElementById("averageBtn").onclick = () => {
            this.displayClear();
            for (let i = 0; i < this.canvasWidth; i++) {
                this.drawColorLine("#FFF67E", i, averageValue * (this.yBarStep / 10) + this.yBarStep);
            }
            document.getElementById("aveBox").innerHTML =
                `평균값: ${averageValue}`;
        }
        document.getElementById("midBtn").onclick = () => {
            this.displayClear();
            // alert(this.valuePrint())
            for (let i = 0; i < this.canvasWidth; i++) {
                this.drawColorLine("#9195F6", i, midValue * (this.yBarStep / 10) + this.yBarStep);
            }
            document.getElementById("midBox").innerHTML = `중위값 : ${midValue}`;
        }
        document.getElementById("minBtn").onclick = () => {
            this.displayClear();
            for (let i = 0; i < this.canvasWidth; i++) {
                this.drawColorLine("#FF8E8F", i, Math.min(...this.copyNameByScoreList) * (this
                    .yBarStep /
                    10) + this.yBarStep);
            }
            this.nameByScoreList.indexOf(Math.min(...this.copyNameByScoreList));
            document.getElementById("minBox").innerHTML =
                `최소 점수: ${Math.min(...this.copyNameByScoreList)} `;
        }
        document.getElementById("maxBtn").onclick = () => {
            this.displayClear();
            for (let i = 0; i < this.canvasWidth; i++) {
                this.drawColorLine("#95D3FF", i, Math.max(...this.copyNameByScoreList) * (this
                    .yBarStep /
                    10) + this.yBarStep);
            }
            this.nameByScoreList.indexOf(Math.max(...this.copyNameByScoreList));
            document.getElementById("maxBox").innerHTML =
                `최고 점수: ${Math.max(...this.copyNameByScoreList)}`;
        }
        document.getElementById("modeBtn").onclick = () => {
            if (countList2.length !== this.copyNameByScoreList.length) {
                this.displayClear();
                // console.log(countList2, countList2.length);
                // console.log(countList, countList.length);
                const displayValuePrint = document.getElementById("modeBox");
                displayValuePrint.innerHTML = "";
                for (let i = 0; i < countList2.length; i++) {
                    for (let j = 0; j < this.canvasWidth; j++) {
                        this.drawColorLine("#AEFF7C", j, countList2[i] * (this.yBarStep / 10) + this
                            .yBarStep);
                    }
                }
                for (let i = 0; i < countList2.length; i++) {
                    displayValuePrint.innerHTML +=
                        `최빈값: ${countList2[i]} <br>`;
                }
            } else {
                this.displayClear();
                const displayValuePrint = document.getElementById("modeBox");
                displayValuePrint.innerHTML = "";
                displayValuePrint.innerHTML +=
                    `2번 이상 반복 된 값이 존재하지 않습니다.`;
            }
        }
        document.getElementById("clearBtn").onclick = () => {
            this.displayClear();
            document.getElementById("aveBox").innerHTML = "";
            document.getElementById("midBox").innerHTML = "";
            document.getElementById("minBox").innerHTML = "";
            document.getElementById("maxBox").innerHTML = "";
            document.getElementById("modeBox").innerHTML = "";
        }
    }
    methodCall() {
        this.xyLineCreate();
        this.xyTextCreate();
        this.xyLineText();
        this.bubbleSort();
        this.drawSlope();
        this.xyDot();
        this.valuePrint();
    }
}

class ModalRest {
    constructor(id) {
        this.id = id;
        this.xhr = new XMLHttpRequest();
        this.xhrStatus = null;
        this.input = document.getElementById("fileInput");
        this.reader = new FileReader();
        this.modal = document.getElementById('modal');

        // this.local = "localhost:2015";
        //this.kkms = "kkms4001.iptime.org:33050";
    }
    displayModal() {
        document.getElementById("modalBtn").addEventListener("click", () => {
            this.modal.style.display = "flex";
        });
        document.getElementById("modalClear").addEventListener("click", () => {
            this.modal.style.display = "none";
        });
        document.getElementById("manualBtn").addEventListener("click", () => {
            this.modal.style.display = "flex";
        });
    }

    readExcel() {
        const excelReg = /\.(xlsx|xls)$/;
        const excelStr = this.input.files[0];
        if (!(this.input.files[0])) {
            return;
        } else if (!(excelReg.test(excelStr.name))) {
            return;
        } else {
            this.reader.onload = () => {
                let data = this.reader.result;
                let workbook = XLSX.read(data, { type: 'binary' });
                workbook.SheetNames.forEach(sheetName => {
                    // console.log('SheetName' + sheetName);
                    let [rows1, rows2] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    for (let name in rows1) {
                        myC.nameList.push(rows1[name]);
                    }
                    for (let score in rows2) {
                        myC.nameByScoreList.push(rows2[score]);
                    }
                    myC.xBarStep = Math.floor(myC.canvasWidth / (myC.nameList.length + 2));
                    myC.yBarStep = Math.floor(myC.canvasHeight / (myC.scoreList.length + 2));
                    // console.log(JSON.stringify(rows));
                })
                myC.displayClear();
                myC.methodCall(); // 그래프 다시 그리기
            }
            this.reader.readAsBinaryString(this.input.files[0]);
        }
    }

    inputFile() {
        document.getElementById("changeBtn").onclick = () => {
            // myC.displayClear();
            myC.nameList = [];
            myC.nameByScoreList = [];
            this.readExcel();
            this.modal.style.display = "none";
        }
    }
    restPostData() {
        //==============post로 데이터 생성((xhr.status === 201)=====================//
        const postInput2 = document.getElementById("postInput2");
        const postInput3 = document.getElementById("postInput3");
        (document.getElementById("postBtn").onclick = () => {
            if (0 <= postInput3.value && postInput3.value < 101 && postInput2.value.length !== 0) {
                this.xhrStatus = 201;
                this.xhr.open("POST", `${myC.local}/graphData`);
                this.xhr.setRequestHeader("Content-type", "application/json");
                this.xhr.send(
                    JSON.stringify({
                        id: String(myC.nameList.length + 1),
                        person_name: postInput2.value,
                        score: String(postInput3.value)
                    })
                );
                this.modal.style.display = "none";
                //this.restData();
                l//ocation.reload();
            } else {
                swal("값을 다시 확인해주세요.");
            }
        });
        this.restData();
        //location.reload();
    }
    restPatchData() {
        //==============patch로 데이터 수정((xhr.status === 200)=====================//
        const patchInput1 = document.getElementById("patchInput");
        const patchInput2 = document.getElementById("patchInput2");
        const patchInput3 = document.getElementById("patchInput3");
        let nameToId = "";
        (document.getElementById("patchBtn").onclick = () => {
            if (0 <= patchInput3.value && patchInput3.value < 101 && patchInput2.value.length !== 0 && patchInput3.value.length !== 0) {
                for (let i = 0; i < myC.nameList.length; i++) {
                    if (patchInput1.value === myC.nameList[i]) {
                        nameToId = String(i + 1);
                    }
                }
                this.xhrStatus = 200;
                this.xhr.open("PATCH", `${myC.local}/graphData/${nameToId}`);
                this.xhr.setRequestHeader("Content-type", "application/json");
                this.xhr.send(
                    JSON.stringify({
                        // id: parseInt(postInput1.value),
                        person_name: patchInput2.value,
                        score: String(patchInput3.value)
                    })
                );
                this.modal.style.display = "none";
                //this.restData();
                //location.reload();
            } else {
                swal("값을 다시 확인해주세요.");
            }
        });
        this.restData();
        //location.reload();
    }

    restDeleteData() {
        let nameToId = "";
        //==============delete로 데이터 삭제((xhr.status === 200)=====================//
        const deleteBtn = document.getElementById("deleteBtn");
        const deleteInput = document.getElementById("deleteInput");
        (deleteBtn.onclick = () => {
            if (deleteInput.value.length !== 0) {
                for (let i = 0; i < myC.nameList.length; i++) {
                    if (deleteInput.value === myC.nameList[i]) {
                        nameToId = myC.id[i];
                    }
                }
                this.xhrStatus = 200;
                this.xhr.open("DELETE", `${myC.local}/graphData/${nameToId}`);
                this.xhr.setRequestHeader("Content-type", "application/json");
                this.xhr.send();
                this.modal.style.display = "none";
                //this.restData();
                //location.reload();
            } else {
                swal("값을 다시 확인해주세요.");
            }
        });
        this.restData();
        //location.reload();
    }

    restData() {
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState !== XMLHttpRequest.DONE) return;
            if (this.xhr.status === this.xhrStatus) {
                // 201: Created
                console.log(this.xhr.responseText);
                location.reload();
            } else {
                console.log("Error!");
            }
        };
    }
    modalMethodCall() {
        this.restPostData();
        this.restPatchData();
        this.restDeleteData();
        this.displayModal()
        this.inputFile();
    }
}
const myC = new CanvasDraw("firstCanvas");
myC.fetchData();

const myR = new ModalRest("canvasModal");
myR.modalMethodCall()
