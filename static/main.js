const selectElement = document.querySelector("select");
const tableHead = document.querySelector("thead");
const tableBody = document.querySelector("tbody");

fetch("/fields")
    .then(res => res.json())
    .then(field => {
        selectElement.innerHTML = "";
        field.forEach(fieldName => {
            const option = document.createElement("option");
            option.value = fieldName;
            option.textContent = fieldName;

            selectElement.append(option);

            const column = document.createElement("th");
            column.textContent = fieldName;

            tableHead.append(column);
        }); 
    });

function fetchQuery(ev) {
    const query = ev.target.value;

    fetch(`/search?field=${selectElement.value}&query=${query}`)
    .then(res => res.json())
    .then(data => {
        tableBody.innerHTML = "";

        data.forEach(item => {
            const tableRow = document.createElement("tr");

            item.forEach(cell => {
                const tableCell = document.createElement("td");
                tableCell.textContent = cell;

                tableRow.append(tableCell);
            });

            tableBody.append(tableRow);
        });
    });
}


let normalCounter = 0;
let throttleCounter = 0;
let debounceCounter = 0;

const normalRequests = document.querySelector("#normalRequests");
const throttleRequests = document.querySelector("#throttleRequests");
const debounceRequests = document.querySelector("#debounceRequests");

const normalInput = document.querySelector("#normal");
const throttleInput = document.querySelector("#throttle");
const debounceInput = document.querySelector("#debounce");

normalInput.addEventListener("input", ev => {
    normalCounter++;
    normalRequests.textContent = normalCounter;
    fetchQuery(ev);
});