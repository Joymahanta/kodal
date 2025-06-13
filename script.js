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
    alert('Unsupported file type. Please upload .csv, .xls, or .xlsx');
  }
});

function showTable(rows) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  rows.forEach((cols, index) => {
    if (cols.length < 2) return;

    const sNo = index + 1;
    const name = cols[0]?.trim();
    const phone = cols[1]?.toString().trim();

    const message = encodeURIComponent(
      `Dear ${name},\n\nWe are pleased to inform you that your job application on Apna has been shortlisted for the interview round at PNB MetLife.\n\nKindly share your updated CV/resume at your earliest convenience. Interview details will be shared with you upon confirmation.\n\nLooking forward to your response.`
    );

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sNo}</td>
      <td>${name}</td>
      <td>${phone}</td>
      <td><button class="dial-btn">Dial</button></td>
      <td></td>
    `;

    // Dial button logic
    const dialButton = row.querySelector('.dial-btn');
    dialButton.addEventListener('click', function () {
      window.location.href = `tel:${phone}`;
      setTimeout(() => {
        const confirmed = confirm(`Did the call to ${phone} connect successfully?`);
        if (confirmed) {
          dialButton.innerText = 'Done';
          dialButton.classList.add('done');
          dialButton.disabled = true;
        }
      }, 1000);
    });

    // WhatsApp button creation
    const whatsappBtn = document.createElement('button');
    whatsappBtn.innerText = 'WhatsApp';
    whatsappBtn.className = 'whatsapp';
    whatsappBtn.addEventListener('click', function () {
      window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
      whatsappBtn.innerText = 'Sent';
      whatsappBtn.disabled = true;
      whatsappBtn.classList.add('done');
    });

    const whatsappCell = row.querySelector('td:last-child');
    whatsappCell.appendChild(whatsappBtn);

    tbody.appendChild(row);
  });
}