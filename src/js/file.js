import { addline } from "./tables.js";

export function RunWithFile(tab1, tab2) {
    var fileInput = document.getElementById('file-button');

    fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            var textToArray = reader.result.split("\r\n");
            
            for (var i = 0; i < textToArray.length; i++)
                textToArray[i] = textToArray[i].split(" ");

            var r = 0;
            while (textToArray[r][0] != '---'){
                addline(tab1, textToArray[r][0], textToArray[r][1]);
                r++;
            }
            for (var i = r + 1; i < textToArray.length; i++){
                addline(tab2, textToArray[i][0], textToArray[i][1]);
            }
        };
    });
}