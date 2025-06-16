document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'csv') {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const rows = text.trim().split('\n').map(line => line.split(','));
      showTable(rows);
    };
    reader.readAsText(file);

  } else if (ext === 'pdf') {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + '\n';
      }

      const lines = text.trim().split('\n').filter(line => line.trim());
      const rows = lines.map(line => {
        const parts = line.split(/,|-/); // support both comma and dash separators
        return [parts[0]?.trim(), parts[1]?.trim()];
      });

      showTable(rows);
    };
    reader.readAsArrayBuffer(file);

  } else if (ext === 'xls' || ext === 'xlsx') {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      showTable(rows);
    };
    reader.readAsArrayBuffer(file);

  } else {
    alert('Unsupported file type. Please upload .csv, .xls, .xlsx, or .pdf');
  }
});