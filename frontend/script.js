const API_URL = 'http://localhost:3001';
let editingId = null;

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
      <div class="fruit-card ${isExpiringSoon ? 'expiring' : ''}" data-storage="${f.storage_location}">
        <h3>${f.name}</h3>
        <p>หมวดหมู่: ${f.category}</p>
        <p>จำนวน: ${f.quantity} ${f.unit}</p>
        <p>ที่เก็บ: ${f.storage_location}</p>
        <p>หมดอายุ: ${f.expiry_date ? f.expiry_date.split('T')[0] : '-'} ${isExpiringSoon ? '⚠️' : ''}</p>
        <p>สถานะ: ${f.status}</p>
        <div class="card-actions">
          <button class="edit-btn" data-id="${f.id}">แก้ไข</button>
          <button class="delete-btn" data-id="${f.id}">ลบ</button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteFruit(btn.dataset.id));
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    const fruit = fruits.find(f => f.id === Number(btn.dataset.id));
    btn.addEventListener('click', () => startEdit(fruit));
  });
}

function startEdit(fruit) {
  editingId = fruit.id;

  document.getElementById('input-name').value = fruit.name;
  document.getElementById('input-category').value = fruit.category;
  document.getElementById('input-quantity').value = fruit.quantity;
  document.getElementById('input-expiry').value = fruit.expiry_date
    ? fruit.expiry_date.split('T')[0]
    : '';

  document.getElementById('submit-btn').textContent = '💾 บันทึกการแก้ไข';
  document.getElementById('add-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  editingId = null;
  document.getElementById('add-form').reset();
  document.getElementById('submit-btn').textContent = '+ เพิ่มผลไม้';
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

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    name: document.getElementById('input-name').value,
    category: document.getElementById('input-category').value,
    quantity: Number(document.getElementById('input-quantity').value),
    expiry_date: document.getElementById('input-expiry').value || null,
  };

  try {
    const url = editingId ? `${API_URL}/api/fruits/${editingId}` : `${API_URL}/api/fruits`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(editingId ? 'แก้ไขข้อมูลไม่สำเร็จ' : 'เพิ่มข้อมูลไม่สำเร็จ');

    cancelEdit();
    loadFruits();
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('filter-category').addEventListener('change', loadFruits);
document.getElementById('filter-location').addEventListener('change', loadFruits);

loadFruits();