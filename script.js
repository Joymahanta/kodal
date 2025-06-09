document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (fileExtension === 'csv') {
    const reader = new FileReader();
    reader.onload = function (e) {
      parseCSV(e.target.result);
    };
    reader.readAsText(file);
  }

  else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      parseExcelOrPDFData(json);
    };
    reader.readAsArrayBuffer(file);
  }

  else if (fileExtension === 'pdf') {
    alert('PDF reading is not supported in this version. Please upload CSV or Excel.');
  }

  else {
    alert('Unsupported file format.');
  }
});

// CSV parser
function parseCSV(content) {
  const lines = content.split('\n').filter(Boolean).map(line => line.split(','));
  parseExcelOrPDFData(lines);
}

// Unified table display
function parseExcelOrPDFData(rows) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  rows.forEach((cols, index) => {
    if (cols.length < 2) return;

    const name = cols[0]?.trim();
    const phone = cols[1]?.trim();

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>${phone}</td>
      <td>
        <a href="tel:${phone}">
          <button data-index="${index}">Dial</button>
        </a>
      </td>
    `;

    tbody.appendChild(row);
  });

  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function () {
      this.innerText = 'Done';
      this.classList.add('done');
      this.disabled = true;
    });
  });
}