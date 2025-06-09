function parseExcelOrPDFData(rows) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  rows.forEach((cols, index) => {
    if (cols.length < 2) return;

    const serial = index + 1;
    const name = cols[0]?.trim();
    const phone = cols[1]?.trim();

    // WhatsApp message (URL encoded)
    const message = encodeURIComponent(
      `Dear Candidate,\n\nWe are pleased to inform you that your job application on Apna has been shortlisted for the interview round at PNB MetLife.\n\nKindly share your updated CV/resume at your earliest convenience. Interview details will be shared with you upon confirmation.\n\nLooking forward to your response.`
    );

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${serial}</td>
      <td>${name}</td>
      <td>${phone}</td>
      <td>
        <a href="tel:${phone}" class="dial-btn">
          <button data-index="${index}">Dial</button>
        </a>
      </td>
      <td>
        <a href="https://wa.me/91${phone}?text=${message}" target="_blank">
          <button class="whatsapp">WhatsApp</button>
        </a>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Dial button confirmation logic
  document.querySelectorAll('.dial-btn button').forEach(button => {
    button.addEventListener('click', function () {
      const phone = this.closest('tr').children[2].innerText;
      setTimeout(() => {
        const confirmed = confirm(`Did the call to ${phone} connect successfully?`);
        if (confirmed) {
          this.innerText = 'Done';
          this.classList.add('done');
          this.disabled = true;
        } else {
          this.innerText = 'Dial';
          this.classList.remove('done');
          this.disabled = false;
        }
      }, 1000);
    });
  });
}