let totalIncome = 0;
let totalExpenses = 0;
let expenses = [];
let users = [];

document.getElementById('income-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const incomeAmount = parseFloat(document.getElementById('income-amount').value);
    addIncome(incomeAmount);
    document.getElementById('income-form').reset();
});

document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;

    addExpense(expenseName, expenseAmount, expenseDate);
    document.getElementById('expense-form').reset();
});

document.getElementById('expense-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.parentNode.parentNode;
        const amount = parseFloat(row.children[1].textContent);
        const date = row.children[2].getAttribute('data-date');
        const name = row.children[0].textContent;

        removeExpense(name, amount, date);
        row.remove();
    }
});

document.getElementById('logout-btn').addEventListener('click', function(e) {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('login-form').reset();
});

document.getElementById('show-signup').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        users.push({ username, password });
        alert('Sign up successful! Please login.');
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    } else {
        alert('Sign up failed. Please try again.');
    }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

function addIncome(amount) {
    totalIncome += amount;
    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    updateTotalBalance();
}

function addExpense(name, amount, date) {
    const expense = { name, amount, date };
    expenses.push(expense);
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

    renderExpenses();
    totalExpenses += amount;
    updateTotalExpenses();
}

function removeExpense(name, amount, date) {
    expenses = expenses.filter(expense => !(expense.name === name && expense.amount === amount && expense.date === date));
    totalExpenses -= amount;
    updateTotalExpenses();
}

function renderExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    const monthlyExpenses = expenses.reduce((acc, expense) => {
        const [year, month] = expense.date.split('-');
        const monthKey = `${year}-${month}`;
        if (!acc[monthKey]) {
            acc[monthKey] = { total: 0, items: [] };
        }
        acc[monthKey].total += expense.amount;
        acc[monthKey].items.push(expense);
        return acc;
    }, {});

    Object.keys(monthlyExpenses).forEach(monthKey => {
        const monthExpenses = monthlyExpenses[monthKey];
        const monthRow = document.createElement('tr');
        monthRow.innerHTML = `
            <td colspan="2"><strong>${formatMonth(monthKey)}</strong></td>
            <td><strong>Total: Rs.${monthExpenses.total.toFixed(2)}</strong></td>
            <td></td>
        `;
        expenseList.appendChild(monthRow);

        monthExpenses.items.forEach(expense => {
            const expenseRow = document.createElement('tr');
            expenseRow.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td data-date="${expense.date}">${formatDate(expense.date)}</td>
                <td><button class="delete-btn">Delete</button></td>
            `;
            expenseList.appendChild(expenseRow);
        });
    });
}

function updateTotalExpenses() {
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    updateTotalBalance();
}

function updateTotalBalance() {
    const totalBalance = totalIncome - totalExpenses;
    document.getElementById('total-balance').textContent = totalBalance.toFixed(2);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function formatMonth(monthKey) {
    const [year, month] = monthKey.split('-');
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}
