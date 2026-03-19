async function loadSilverPrices() {
  try {
    const response = await fetch('data.json?v=' + Date.now());
    const jsonData = await response.json();

    // Build a lookup map: key = "LoaiBacThuongPham|BoSuuTap|DonViTinh"
    const priceMap = {};
    jsonData.forEach(item => {
      const key = `${item.LoaiBacThuongPham}|${item.BoSuuTap}|${item.DonViTinh}`;
      priceMap[key] = {
        giaMua: item.DonGiaMua,
        giaBan: item.DonGiaBan
      };
    });

    function formatPrice(price) {
      if (!price || price === 0) return '';
      return price.toLocaleString('vi-VN');
    }

    // Map each row in the HTML table to the correct data key
    // Format: [LoaiBacThuongPham, BoSuuTap, DonViTinh]
    const rowMappings = [
      // Ngân Gia Bảo rows (order matches HTML)
      ['Ngân Gia Bảo', 'Tứ quý CN 1 lượng (Tùng, Cúc, Trúc, Mai)', 'Lượng'],
      ['Ngân Gia Bảo', 'Tứ quý CN 3 lượng (Tùng, Cúc, Trúc, Mai)', 'Lượng'],
      ['Ngân Gia Bảo', 'Thỏi 5 lượng',  'Lượng'],
      ['Ngân Gia Bảo', 'Thỏi 10 lượng', 'Lượng'],
      ['Ngân Gia Bảo', 'Thỏi 1 kilô',   'Kilogam'],
      // Nguyên liệu rows
      ['Nguyên liệu', '', 'Lượng'],
      ['Nguyên liệu', '', 'Kilogam'],
    ];

    const rows = document.querySelectorAll('#price-table-body tr');

    rows.forEach((row, index) => {
      if (index >= rowMappings.length) return;

      const [loai, bo, donVi] = rowMappings[index];
      const key = `${loai}|${bo}|${donVi}`;
      const prices = priceMap[key] || { giaMua: 0, giaBan: 0 };

      const cells = row.querySelectorAll('td');
      // Price cells are always the last 2
      const muaCell = cells[cells.length - 2];
      const banCell = cells[cells.length - 1];

      muaCell.textContent = formatPrice(prices.giaMua);
      banCell.textContent = formatPrice(prices.giaBan);
    });

  } catch (error) {
    console.error('Error loading silver prices:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadSilverPrices);