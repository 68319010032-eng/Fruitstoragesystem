const API_URL = 'http://localhost:3001';

async function loadFruits() {
  const listEl = document.getElementById('fruit-list');
  try {
    const res = await fetch(`${API_URL}/api/fruits`);
    const fruits = await res.json();
    renderFruits(fruits);
  } catch (err) {
    listEl.innerHTML = `<p>❌ โหลดข้อมูลไม่สำเร็จ: ${err.message}</p>`;
  }
}

function renderFruits(fruits) {
  const listEl = document.getElementById('fruit-list');

  if (fruits.length === 0) {
    listEl.innerHTML = '<p>ไม่มีข้อมูลผลไม้</p>';
    return;
  }

  listEl.innerHTML = fruits.map(f => `
    <div class="fruit-card">
      <h3>${f.name}</h3>
      <p>หมวดหมู่: ${f.category}</p>
      <p>จำนวน: ${f.quantity} ${f.unit}</p>
      <p>ที่เก็บ: ${f.storage_location}</p>
      <p>หมดอายุ: ${f.expiry_date ? f.expiry_date.split('T')[0] : '-'}</p>
      <p>สถานะ: ${f.status}</p>
    </div>
  `).join('');
}

loadFruits();