document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    showTable(rows);
  };

  reader.readAsArrayBuffer(file);
});

function showTable(rows) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  rows.forEach((cols, index) => {
    if (cols.length < 2 || !cols[0] || !cols[1]) return;

    const sNo = index + 1;
    const name = cols[0].toString().trim();
    const phone = cols[1].toString().trim();

    const messageText = `Dear ${name},\n\nWe are pleased to inform you that your job application on Apna has been shortlisted for the interview round at PNB MetLife.\n\nKindly share your updated CV/resume at your earliest convenience to mahantajoy1234@gmail.com. Interview details will be shared with you upon confirmation.\n\nLooking forward to your response.`;
    const messageEncoded = encodeURIComponent(messageText);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sNo}</td>
      <td>${name}</td>
      <td>${phone}</td>
      <td><button class="dial-btn">Dial</button></td>
      <td></td>
    `;

    // Dial button
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

    // WhatsApp button
    const whatsappBtn = document.createElement('button');
    whatsappBtn.innerText = 'WhatsApp';
    whatsappBtn.className = 'whatsapp';
    whatsappBtn.addEventListener('click', function () {
      window.open(`https://wa.me/${phone}?text=${messageEncoded}`, '_blank');
      whatsappBtn.innerText = 'Sent';
      whatsappBtn.classList.add('done');
      whatsappBtn.disabled = true;
    });

    // SMS fallback button
    const smsBtn = document.createElement('button');
    smsBtn.innerText = 'Message';
    smsBtn.className = 'sms';
    smsBtn.addEventListener('click', function () {
      window.location.href = `sms:${phone}?body=${messageEncoded}`;
      smsBtn.innerText = 'Sent';
      smsBtn.classList.add('done');
      smsBtn.disabled = true;
    });

    const lastCell = row.querySelector('td:last-child');
    lastCell.appendChild(whatsappBtn);
    lastCell.appendChild(document.createTextNode(' ')); // spacing
    lastCell.appendChild(smsBtn);

    tbody.appendChild(row);
  });
}