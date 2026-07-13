const API_URL = 'http://localhost:3001';

async function loadFruits() {
  const listEl = document.getElementById('fruit-list');
  const category = document.getElementById('filter-category').value;
  const location = document.getElementById('filter-location').value;

  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (location) params.append('storage_location', location);

  try {
    const res = await fetch(`${API_URL}/api/fruits?${params}`);
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

  const today = new Date();

  listEl.innerHTML = fruits.map(f => {
    const isExpiringSoon = f.expiry_date &&
      (new Date(f.expiry_date) - today) / (1000 * 60 * 60 * 24) <= 3;

    return `
      <div class="fruit-card ${isExpiringSoon ? 'expiring' : ''}">
        <h3>${f.name}</h3>
        <p>หมวดหมู่: ${f.category}</p>
        <p>จำนวน: ${f.quantity} ${f.unit}</p>
        <p>ที่เก็บ: ${f.storage_location}</p>
        <p>หมดอายุ: ${f.expiry_date ? f.expiry_date.split('T')[0] : '-'} ${isExpiringSoon ? '⚠️' : ''}</p>
        <p>สถานะ: ${f.status}</p>
        <button class="delete-btn" data-id="${f.id}">ลบ</button>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteFruit(btn.dataset.id));
  });
}

async function deleteFruit(id) {
  if (!confirm('ยืนยันลบผลไม้นี้?')) return;
  try {
    await fetch(`${API_URL}/api/fruits/${id}`, { method: 'DELETE' });
    loadFruits();
  } catch (err) {
    alert('ลบไม่สำเร็จ: ' + err.message);
  }
}

document.getElementById('filter-category').addEventListener('change', loadFruits);
document.getElementById('filter-location').addEventListener('change', loadFruits);
document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    name: document.getElementById('input-name').value,
    category: document.getElementById('input-category').value,
    quantity: Number(document.getElementById('input-quantity').value),
    expiry_date: document.getElementById('input-expiry').value || null,
  };

  try {
    const res = await fetch(`${API_URL}/api/fruits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('เพิ่มข้อมูลไม่สำเร็จ');
    e.target.reset();
    loadFruits();
  } catch (err) {
    alert(err.message);
  }
});

loadFruits();