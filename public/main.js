let customTypes = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customTypesForm');
    const customTypesList = document.getElementById('customTypesList');
    const downloadTypesCSV = document.getElementById('downloadTypesCSV');
    const downloadSlicesCSV = document.getElementById('downloadSlicesCSV');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const repositoryId = document.getElementById('repositoryId').value;
        const bearerToken = document.getElementById('bearerToken').value;

        try {
            const response = await fetch('getCustomTypes', {
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ repositoryId, bearerToken })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            customTypes = await response.json();
            displayCustomTypes(customTypes);
            displayAllSlices(customTypes);

            downloadTypesCSV.addEventListener('click', () => generateTypesCSV());
            downloadSlicesCSV.addEventListener('click', () => generateSlicesCSV());

        } catch (error) {
            console.error('Error fetching custom types:', error);
        }
    });

    function displayCustomTypes(customTypes) {
        customTypesList.innerHTML = '';

        customTypes.forEach(type => {
            const listItem = document.createElement('li');
            listItem.textContent = `${type.id} - `;
            displaySlicesForType(type.json, listItem);
            customTypesList.appendChild(listItem);
        });
    }

    function displaySlicesForType(json, listItem) {
        let slices = [];
        findSlices(json, slices);

        const slicesText = slices.length > 0 
            ? document.createTextNode(`Slices: ${slices.join(', ')}`) 
            : document.createTextNode('No Slices Found');
        listItem.appendChild(slicesText);
    }
    function displayAllSlices(customTypes) {
        const allSlicesList = document.getElementById('allSlicesList');
        allSlicesList.innerHTML = '';

        let allSlices = {};

        customTypes.forEach(type => {
            let slices = [];
            findSlices(type.json, slices);

            slices.forEach(slice => {
                if (!allSlices[slice]) {
                    allSlices[slice] = [];
                }
                allSlices[slice].push(type.id);
            });
        });

        for (const [sliceKey, typeIds] of Object.entries(allSlices)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${sliceKey} - Found in Types: ${typeIds.join(', ')}`;
            allSlicesList.appendChild(listItem);
        }
    }

    function findSlices(obj, slices) {
        if (obj !== null && typeof obj === 'object') {
            if (obj.hasOwnProperty('config') && obj.config.hasOwnProperty('choices')) {
                for (const [key, value] of Object.entries(obj.config.choices)) {
                    if (value.type === "Slice") {
                        slices.push(key);
                    }
                }
            }
            Object.values(obj).forEach(value => {
                findSlices(value, slices);
            });
        }
    }
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
    
    function generateTypesCSV() {
        let csvContent = 'type,slices\n';
        customTypes.forEach(type => {
            let slices = [];
            findSlices(type.json, slices); // Correctly using findSlices with slices array
            let slicesText = slices.length > 0 ? slices.join(', ') : 'No Slices Found';
            csvContent += `"${type.id}","${slicesText}"\n`;
        });
        downloadCSV(csvContent, 'types.csv');
    }
    
    function generateSlicesCSV() {
        let allSlices = {};
        customTypes.forEach(type => {
            let slices = [];
            findSlices(type.json, slices); // Correctly using findSlices with slices array
            slices.forEach(slice => {
                if (!allSlices[slice]) {
                    allSlices[slice] = new Set();
                }
                allSlices[slice].add(type.id);
            });
        });
    
        let csvContent = 'slice,types\n';
        for (const [sliceKey, typeIds] of Object.entries(allSlices)) {
            let typeList = Array.from(typeIds).join(', ');
            csvContent += `"${sliceKey}","${typeList}"\n`;
        }
        downloadCSV(csvContent, 'slices.csv');
    }    
    
    // Add event listeners to download links in your HTML
    document.getElementById('downloadTypesCSV').addEventListener('click', () => generateTypesCSV(customTypes));
    document.getElementById('downloadSlicesCSV').addEventListener('click', () => generateSlicesCSV(customTypes));    
});