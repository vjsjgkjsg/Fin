
const storage = (() => {
  // ключ в localStorage
  const STORAGE_KEY = "financeAppData";

  // Изначальная структура
  let data = {
    pin: "1234", // дефолтный PIN, можно изменить
    categories: {
      income: { id: "income", name: "Получил", type: "income", color: "#22c55e", records: [] },
      spent:  { id: "spent",  name: "Потратил", type: "spent",  color: "#f59e0b", records: [] },
      debt:   { id: "debt",   name: "Долг",     type: "debt",   color: "#ef4444", records: [] },
    }
  };

  // Загрузка из localStorage
  const load = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch(e) {
        console.warn("Ошибка загрузки данных:", e);
      }
    }
  };

  // Сохранение в localStorage
  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Добавление новой категории
  const addCategory = (name, type, color) => {
    const id = "cat_" + Date.now();
    data.categories[id] = { id, name, type, color, records: [] };
    save();
    return data.categories[id];
  };

  // Добавление записи
  const addRecord = (categoryId, amount, comment = "") => {
    if (!data.categories[categoryId]) return;
    const now = new Date();
    const record = {
      id: "rec_" + Date.now(),
      amount: Number(amount),
      comment,
      date: now.toISOString(), // сохраняем дату
      month: now.getMonth() + 1, // для фильтров по месяцам
      year: now.getFullYear()
    };
    data.categories[categoryId].records.push(record);
    save();
    return record;
  };

  // Редактирование записи
  const editRecord = (categoryId, recordId, newAmount, newComment) => {
    const cat = data.categories[categoryId];
    if (!cat) return;
    const rec = cat.records.find(r => r.id === recordId);
    if (!rec) return;
    rec.amount = Number(newAmount);
    rec.comment = newComment;
    save();
  };

  // Удаление записи с подтверждением
  const deleteRecord = (categoryId, recordId) => {
    const cat = data.categories[categoryId];
    if (!cat) return;
    const index = cat.records.findIndex(r => r.id === recordId);
    if (index === -1) return;
    if (confirm("Вы точно хотите удалить эту запись?")) {
      cat.records.splice(index, 1);
      save();
    }
  };

  // Получить все записи по категории
  const getRecords = (categoryId) => {
    return data.categories[categoryId] ? data.categories[categoryId].records : [];
  };

  // Получить все категории
  const getCategories = () => Object.values(data.categories);

  // Получить баланс
  const getBalance = () => {
    let income = 0, spent = 0, debt = 0;
    for (let cat of Object.values(data.categories)) {
      const total = cat.records.reduce((a,b)=>a+b.amount,0);
      if (cat.type === "income") income += total;
      else if (cat.type === "spent") spent += total;
      else if (cat.type === "debt") debt += total;
    }
    return income - spent - debt;
  };

  // Экспорт JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finance_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Импорт JSON
  const importJSON = (json) => {
    try {
      const imported = JSON.parse(json);
      if (imported.categories) {
        data = imported;
        save();
        return true;
      }
    } catch(e) {
      console.error("Ошибка импорта:", e);
    }
    return false;
  };

  // Фильтр по месяцу
  const getRecordsByMonth = (categoryId, month, year) => {
    const recs = getRecords(categoryId);
    if (month === "all") return recs;
    return recs.filter(r => r.month === Number(month) && r.year === Number(year));
  };

  // Проверка PIN
  const checkPin = (pin) => data.pin === pin;

  // Смена PIN
  const setPin = (newPin) => {
    data.pin = newPin;
    save();
  };

  load(); // загрузка при подключении

  return {
    addCategory,
    addRecord,
    editRecord,
    deleteRecord,
    getRecords,
    getCategories,
    getBalance,
    exportJSON,
    importJSON,
    getRecordsByMonth,
    checkPin,
    setPin,
    save
  };
})();
