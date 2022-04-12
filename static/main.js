const selectElement = document.querySelector("select");

fetch("/tables")
    .then(res => res.json())
    .then(tables => {
        selectElement.innerHTML = "";
        tables.forEach(tableName => {
            const option = document.createElement("option");
            option.value = tableName;
            option.textContent = tableName;

            selectElement.append(option);
        }); 
    });