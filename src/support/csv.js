// source: https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2

function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

const headers = {
  type: "Type (-)",
  baseId: "Base ID",
  lot: "Lot ID (-)",
  split: "Split ID (-)",
  partId: "Part ID",
  quote: "Work Order/Engineering Master/Quote Master (-)",
  description: "Part Description",
  status: "Status",
  quantity: "Quantity",
  desiredRIsDate: "Desired Rls Date",
  desiredWantDate: "Desired Want Date",
  code: "Commodity Code"
};

const fileTitle = 'schedule'; // or 'my-unique-title'

function exportCSVFile(orders, index) {
  const items = orders.map(order => ({
    type: ' ',
    baseId: order.baseId,
    lot: ' ',
    split: ' ',
    partId: order.partId,
    quote: ' ',
    description: order.description,
    status: order.status,
    quantity: order.quantity,
    desiredRIsDate: ' ',
    desiredWantDate: ' ',
    code: order.code
  }))

  items.unshift(headers);

  const jsonObject = JSON.stringify(items);
  const csv = convertToCSV(jsonObject);
  const exportedFilenmae = `${fileTitle}_${index + 1}.csv`;
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });

  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function csvJSON(csv) {
  const rows = csv.split("\n");
  const result = [];
  const headers = rows[0].split(",");

  for (let i = 1; i < rows.length; i++) {
    const item = [];
    const cells = rows[i].split(",");

    if (!cells[1]) {
      continue
    }

    for (var j = 0; j < headers.length; j++) {
      item.push(cells[j]);
    }

    result.push(item);
  }

  return result
}

export {
  exportCSVFile,
  csvJSON
}
