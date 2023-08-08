function createHistory(data, table) {
  data.forEach((dictionary) => {
    const row = document.createElement('tr');
    Object.entries(dictionary).forEach(([key, value]) => {
      const cell = document.createElement('td');
      cell.setAttribute('class', 'historyclass');
      if (key === 'stillInPossess') {
        console.log('here at still in possess');
        if (value === 1) {
          value = 'Still in possess';
        } else {
          value = 'Already returned';
        }
      }
      cell.textContent = value;

      row.appendChild(cell);
    });

    table.appendChild(row);
  });
  table.classList.remove('hide');
  table.classList.add('show');
}

function hideTable(table) {
  table.classList.add('hide');
  table.classList.remove('show');
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function processAdminButton(data, buttonText, button, role) {
  console.log(data);
  if (role === 'admin') {
    buttonText = 'Admin -';
  } else {
    buttonText = 'Admin +';
  }
  button.textContent = buttonText;
}

function processHistoryData(data, table) {
  if (data[0].length === 0) {
    alert("You don't have a history yet");
    return;
  }
  createHistory(data, table);
}

function processDescription(ul, data) {
  const descriptionElement = ul.querySelector('.value-description');
  descriptionElement.textContent = data.description;
}

window.addEventListener('DOMContentLoaded', () => {
  const ulPackeges = Array.from(document.getElementsByClassName('vau'));
  ulPackeges.forEach((ul) => {
    ul.addEventListener('click', () => {
      const { id } = ul;
      console.log('My id is: ', id);
      fetch(`/description/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          processDescription(ul, data);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(`Error: ${error}`);
        });
    });
  });

  const buttons = document.getElementsByClassName('history-button');
  Array.from(buttons).forEach((button) => {
    let clickCount = 0;
    const username = button.id;
    button.addEventListener('click', () => {
      clickCount++;
      const table = document.getElementById('historytable');
      if (clickCount % 2 === 0) {
        hideTable(table);
        return;
      }
      console.log('My username is: ', username);
      fetch(`/history/${username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          processHistoryData(data, table);
        })
        .catch((error) => {
          alert(`Error: ${error}`);
        });
    });
  });

  const adminButtons = document.getElementsByClassName('admin-button');
  Array.from(adminButtons).forEach((button) => {
    button.addEventListener('click', () => {
      const username = button.id;
      const buttonText = button.textContent;
      let role = 'user';
      console.log(buttonText);
      if (buttonText === 'Admin +') {
        role = 'admin';
      }
      console.log('My username is: ', username);
      fetch(`/adminrights/${username}/${role}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          processAdminButton(data, buttonText, button, role);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(`Error: ${error}`);
        });
    });
  });
});
