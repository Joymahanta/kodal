function showTable(rows) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  rows.forEach((cols, index) => {
    if (cols.length < 2) return;

    const sNo = index + 1;
    const name = cols[0]?.trim();
    const phone = cols[1]?.toString().trim();

    const message = encodeURIComponent(
      `Dear ${name},\n\nWe are pleased to inform you that your job application on Apna has been shortlisted for the interview round at PNB MetLife.\n\nKindly share your updated CV/resume at your earliest convenience to mahantajoy1234@gmail.com. Interview details will be shared with you upon confirmation.\n\nLooking forward to your response.`
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

    // SMS button logic
    const smsBtn = document.createElement('button');
    smsBtn.innerText = 'Message';
    smsBtn.className = 'sms';
    smsBtn.addEventListener('click', function () {
      window.location.href = `sms:${phone}?body=${message}`;
      smsBtn.innerText = 'Sent';
      smsBtn.disabled = true;
      smsBtn.classList.add('done');
    });

    const smsCell = row.querySelector('td:last-child');
    smsCell.appendChild(smsBtn);

    tbody.appendChild(row);
  });
}