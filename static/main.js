const selectElement = document.querySelector("select");
const tableHead = document.querySelector("thead");

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