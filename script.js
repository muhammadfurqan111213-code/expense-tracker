
/* Get saved expenses from localStorage.
   If no data exists, use an empty array. */
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Get HTML elements
const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("expenseTitle");
const amountInput = document.getElementById("expenseAmount");
const categoryInput = document.getElementById("expenseCategory");
const dateInput = document.getElementById("expenseDate");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");
const recordCount = document.getElementById("recordCount");
const formMessage = document.getElementById("formMessage");

// Set today's date by default
dateInput.value = new Date().toISOString().split("T")[0];

// Format the amount in Pakistani rupees
function formatMoney(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Save expenses in localStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Display all expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">
                    No expenses yet. Add your first one!
                </td>
            </tr>
        `;
    } else {
        // Sort records by date, newest first
        const sortedExpenses = [...expenses].sort(function(a, b) {
            return b.date.localeCompare(a.date);
        });

        sortedExpenses.forEach(function(expense) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="expense-title"></td>
                <td><span class="category-tag"></span></td>
                <td></td>
                <td class="amount-cell"></td>
                <td>
                    <button class="delete-button" type="button">
                        Delete
                    </button>
                </td>
            `;

            // Add expense information to the row
            row.cells[0].textContent = expense.title;

            row.cells[1].querySelector(".category-tag").textContent =
                expense.category;

            row.cells[2].textContent = expense.date;
            row.cells[3].textContent = formatMoney(expense.amount);

            // Delete the selected expense
            row.querySelector(".delete-button").addEventListener(
                "click",
                function() {
                    deleteExpense(expense.id);
                }
            );

            expenseList.appendChild(row);
        });
    }

    // Calculate the total of all expenses
    const total = expenses.reduce(function(sum, expense) {
        return sum + Number(expense.amount);
    }, 0);

    totalExpense.textContent = formatMoney(total);

    // Update the number of saved records
    recordCount.textContent =
        expenses.length +
        (expenses.length === 1 ? " record saved" : " records saved");
}

// Add a new expense when the form is submitted
expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    // Validate the entered information
    if (
        title === "" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        category === "" ||
        date === ""
    ) {
        formMessage.textContent =
            "Please enter valid details in every field.";
        return;
    }

    // Create an expense object
    const newExpense = {
        id: Date.now(),
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    // Add the object to the array
    expenses.push(newExpense);

    // Save and refresh the table
    saveExpenses();
    displayExpenses();

    // Clear the form
    expenseForm.reset();

    // Set today's date again
    dateInput.value = new Date().toISOString().split("T")[0];

    formMessage.textContent = "Expense added successfully!";
    titleInput.focus();
});

// Delete one expense using its unique ID
function deleteExpense(id) {
    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    // Update localStorage and the displayed records
    saveExpenses();
    displayExpenses();

    formMessage.textContent = "Expense deleted.";
}

// Display previously saved expenses on page load
displayExpenses();
