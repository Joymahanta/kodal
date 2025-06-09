document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split('\n');
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    lines.forEach((line, index) => {
      const [name, phone] = line.split(',');
      if (!name || !phone) return;

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${name.trim()}</td>
        <td>${phone.trim()}</td>
        <td>
          <a href="tel:${phone.trim()}" class="dial-btn">
            <button data-index="${index}">Dial</button>
          </a>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Add event listener for each button
    document.querySelectorAll('.dial-btn button').forEach(button => {
      button.addEventListener('click', function () {
        this.innerText = 'Done';
        this.classList.add('done');
        this.disabled = true;
      });
    });
  };

  reader.readAsText(file);
});