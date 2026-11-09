let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
  document.querySelector('#data-error').hidden = false;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const picked = [];
  if (guideChecked) {
    picked.push('guide');
  }
  if (audioChecked) {
    picked.push('audio');
  }
  if (catalogChecked) {
    picked.push('catalog');
  }

  const chosen = services.filter(function (service) {
    return picked.indexOf(service.id) !== -1;
  });

  const items = chosen.map(function (service) {
    const { title, price } = service;
    return { title: title.trim(), price: price };
  });

  const total = items.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  return {
    count: items.length,
    total: total,
    items: items
  };
}

if (data !== null) {
  const programBlock = document.querySelector('#program');
  const form = document.querySelector('#service-form');
  const choiceError = document.querySelector('#choice-error');
  const resultBlock = document.querySelector('#result');
  const jsonBlock = document.querySelector('#report-json');

  form.hidden = false;

  document.querySelector('#show-program').addEventListener('click', function () {
    programBlock.hidden = false;
    programBlock.innerHTML = data.event.meeting;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const guideChecked = document.querySelector('#guide').checked;
    const audioChecked = document.querySelector('#audio').checked;
    const catalogChecked = document.querySelector('#catalog').checked;

    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

    if (report.count === 0) {
      choiceError.hidden = false;
      resultBlock.hidden = true;
      jsonBlock.hidden = true;
    } else {
      choiceError.hidden = true;

      const lines = report.items.map(function (item) {
        return item.title;
      });

      resultBlock.innerHTML =
        'Выбрано услуг: ' + report.count + '<br>' +
        'Итого: ' + report.total + ' руб.<br>' +
        lines.join('<br>');

      const jsonString = JSON.stringify(report);
      JSON.parse(jsonString);
      jsonBlock.textContent = jsonString;

      resultBlock.hidden = false;
      jsonBlock.hidden = false;
    }
  });
}
