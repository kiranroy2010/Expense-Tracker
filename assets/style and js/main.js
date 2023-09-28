// Define the calculateTotalExpense function outside the event listener block
function calculateTotalExpense(deletedExpense) {
    // Define the getCookie function within the calculateTotalExpense function scope
    function getCookie(name) {
        const cookieValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
        return cookieValue ? decodeURIComponent(cookieValue[2]) : null;
    }

    const savedExpenses = JSON.parse(getCookie("expenses")) || [];
    let totalExpense = 0;

    // Iterate through saved expenses and add up the prices
    for (const expense of savedExpenses) {
        const price = parseFloat(expense.price); // Convert price to a floating-point number
        if (!isNaN(price)) {
            totalExpense += price;
        }
    }

    // If a deletedExpense is provided, subtract its price from the total
    if (deletedExpense) {
        const deletedPrice = parseFloat(deletedExpense.price);
        if (!isNaN(deletedPrice)) {
            totalExpense -= deletedPrice;
        }
    }

    // Update the HTML element with the total expense
    const totalExpenseElement = document.getElementById("total_expense");
    totalExpenseElement.textContent = `Total Expense: ₹ ${totalExpense.toFixed(2)}`;
}


// Section: Page Initialization

window.addEventListener('load', () => {
    let expensePrice;
    const form = document.querySelector("#new_expense_form");
    const input = document.querySelector("#new_expense_input");
    const priceInput = document.querySelector("#new_expense_price");
    const dateInput = document.querySelector("#new_expense_date");
    const list_el = document.querySelector("#expenses");

    // Function to update the date input with the current date and time
    function updateCurrentDateTime() {
        const currentDate = new Date();

        // Get the current date and time as strings
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        // Format the date and time string as "YYYY-MM-DDTHH:mm:ss"
        const currentDateString = `${year}-${month}-${day} [${hours}:${minutes}:${seconds}]`;

        // Set the date input value to the current date and time
        dateInput.value = currentDateString;
    }

    // Set an initial update of the date and time
    updateCurrentDateTime();

    // Update the date and time every second
    setInterval(updateCurrentDateTime, 1000);

    // Section: Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const expenseText = input.value;
        expensePrice = priceInput.value;
        const expenseDate = dateInput.value;

        if (expenseText.trim() === "" || expensePrice.trim() === "" || expenseDate.trim() === "") {
            return; // Don't add empty expenses, prices, or dates
        }

        // Section: Create Expense Element
        const expense_el = document.createElement('div');
        expense_el.classList.add('expense');

        const expense_content_el = document.createElement('div');
        expense_content_el.classList.add('content');

        expense_el.appendChild(expense_content_el);

        const expense_item_el = document.createElement('span'); // Create a span for the item
        expense_item_el.classList.add('item');
        expense_item_el.textContent = `Item: ${expenseText}`; // Display item text

        expense_content_el.appendChild(expense_item_el);

        const expense_price_el = document.createElement('span'); // Create a span for the price
        expense_price_el.classList.add('price');
        expense_price_el.textContent = `Price: ${expensePrice}`; // Display price text

        expense_content_el.appendChild(expense_price_el);

        const expense_date_el = document.createElement('span'); // Create a span for the date
        expense_date_el.classList.add('date');
        expense_date_el.textContent = expenseDate; // Display date text

        expense_content_el.appendChild(expense_date_el);

        const expense_actions_el = document.createElement('div');
        expense_actions_el.classList.add('action');

        const expense_edit_el = document.createElement('button');
        expense_edit_el.classList.add('edit');
        expense_edit_el.innerText = 'Edit';

        const expense_delete_el = document.createElement('button');
        expense_delete_el.classList.add('delete');
        expense_delete_el.innerText = 'Delete';

        expense_actions_el.appendChild(expense_edit_el);
        expense_actions_el.appendChild(expense_delete_el);

        expense_el.appendChild(expense_actions_el);
		location.reload()

        // Add event listeners for edit and delete buttons
        expense_edit_el.addEventListener('click', () => {
            if (expense_edit_el.innerText.toLowerCase() === "edit") {
                expense_edit_el.innerText = "Save";
                expense_item_el.contentEditable = true;
                expense_price_el.contentEditable = true;
                expense_date_el.contentEditable = true;
                expense_item_el.focus();
                // After editing an expense, call calculateTotalExpense to update the total
        calculateTotalExpense();
            } else {
                // Save the edited expense
                const updatedExpenseText = expense_item_el.textContent.replace("Item: ", "");
                const updatedExpensePrice = expense_price_el.textContent.replace("Price: ", "");
                const updatedExpenseDate = expense_date_el.textContent;

                expense_item_el.textContent = `Item: ${updatedExpenseText}`;
                expense_price_el.textContent = `Price: ${updatedExpensePrice}`;

                // Save only the item and price without the "Item: " and "Price: " prefixes
                expenseText = updatedExpenseText;
                expensePrice = updatedExpensePrice;
                expenseDate = updatedExpenseDate;

                // Update the saved expenses and cookies
                const updatedExpenses = savedExpenses.map((e) => {
                    if (e.text === expenseText) {
                        e.text = updatedExpenseText;
                        e.price = updatedExpensePrice;
                        e.date = updatedExpenseDate;
                    }
                    return e;
                });
                setCookie("expenses", JSON.stringify(updatedExpenses));

                expense_item_el.contentEditable = false;
                expense_price_el.contentEditable = false;
                expense_date_el.contentEditable = false;
                expense_edit_el.innerText = "Edit";

                  // Recalculate and display the total expense
                  calculateTotalExpense();
            }
        });

        expense_delete_el.addEventListener('click', () => {
            list_el.removeChild(expense_el);
            // Remove the expense from the saved expenses in cookies
            const updatedExpenses = savedExpenses.filter((e) => e.text !== expenseText);
            setCookie("expenses", JSON.stringify(updatedExpenses));
             // Recalculate and display the total expense
             calculateTotalExpense({ price: expensePrice });
             location.reload()
        });

        // Add new expenses to the top of the list
        list_el.insertBefore(expense_el, list_el.firstChild);

        input.value = '';
        priceInput.value = '';

        // Section: Save Expense to Cookies
        const savedExpenses = JSON.parse(getCookie("expenses")) || [];
        const expense = { text: expenseText, price: expensePrice, date: expenseDate };
        savedExpenses.unshift(expense);
        setCookie("expenses", JSON.stringify(savedExpenses));
         // Recalculate and display the total expense
         calculateTotalExpense();
    });

    // Section: Load and Display Expenses from Cookies
    const savedExpenses = JSON.parse(getCookie("expenses")) || [];
    savedExpenses.forEach((expense) => {
        const expense_el = document.createElement('div');
        expense_el.classList.add('expense');

        const expense_content_el = document.createElement('div');
        expense_content_el.classList.add('content');

        expense_el.appendChild(expense_content_el);

        const expense_item_el = document.createElement('span');
        expense_item_el.classList.add('item');
        expense_item_el.textContent = `Item: ${expense.text}`;

        expense_content_el.appendChild(expense_item_el);

        const expense_price_el = document.createElement('span');
        expense_price_el.classList.add('price');
        expense_price_el.textContent = `Price: ${expense.price}`;

        expense_content_el.appendChild(expense_price_el);

        const expense_date_el = document.createElement('span');
        expense_date_el.classList.add('date');
        expense_date_el.textContent = expense.date;

        expense_content_el.appendChild(expense_date_el);

        const expense_actions_el = document.createElement('div');
        expense_actions_el.classList.add('action');

        const expense_edit_el = document.createElement('button');
        expense_edit_el.classList.add('edit');
        expense_edit_el.innerText = 'Edit';

        const expense_delete_el = document.createElement('button');
        expense_delete_el.classList.add('delete');
        expense_delete_el.innerText = 'Delete';

        expense_actions_el.appendChild(expense_edit_el);
        expense_actions_el.appendChild(expense_delete_el);

        expense_el.appendChild(expense_actions_el);

        list_el.appendChild(expense_el);

        // Section: Edit and Save Expense
        expense_edit_el.addEventListener('click', () => {
            if (expense_edit_el.innerText.toLowerCase() === "edit") {
                expense_edit_el.innerText = "Save";
                expense_item_el.contentEditable = true;
                expense_price_el.contentEditable = true;
                expense_date_el.contentEditable = true;
                expense_item_el.focus();
                // After saving an edited expense, call calculateTotalExpense to update the total
        calculateTotalExpense();
            } else {
                // Save the edited expense
                const updatedExpenseText = expense_item_el.textContent.replace("Item: ", ""); // Remove "Item: " prefix
                const updatedExpensePrice = expense_price_el.textContent.replace("Price: ", ""); // Remove "Price: " prefix
                const updatedExpenseDate = expense_date_el.textContent;

                // Update the displayed item and price
                expense_item_el.textContent = `Item: ${updatedExpenseText}`;
                expense_price_el.textContent = `Price: ${updatedExpensePrice}`;

                // Save only the item and price without the "Item: " and "Price: " prefixes
                expense.text = updatedExpenseText;
                expense.price = updatedExpensePrice;
                expense.date = updatedExpenseDate;

                // Update the saved expenses and cookies
                const updatedExpenses = savedExpenses.map((e) => {
                    if (e.text === expense.text) {
                        e.text = updatedExpenseText;
                        e.price = updatedExpensePrice;
                        e.date = updatedExpenseDate;
                    }
                    return e;
                });
                setCookie("expenses", JSON.stringify(updatedExpenses));

                // Disable contentEditable and change button text back to "Edit"
                expense_item_el.contentEditable = false;
                expense_price_el.contentEditable = false;
                expense_date_el.contentEditable = false;
                expense_edit_el.innerText = "Edit";
                // After saving an edited expense, call calculateTotalExpense to update the total
        calculateTotalExpense();
            }
        });

        expense_delete_el.addEventListener('click', () => {
            list_el.removeChild(expense_el);
            // Remove the expense from the saved expenses in cookies
            const updatedExpenses = savedExpenses.filter((e) => e.text !== expense.text);
            setCookie("expenses", JSON.stringify(updatedExpenses));
            // Recalculate and display the total expense
            calculateTotalExpense({ price: expensePrice });
            location.reload()

        });
        // End of Edit and Save Expense
    });
    // End of Load and Display Expenses from Cookies

    // Helper functions for working with cookies (same as before)
    function setCookie(name, value, days = 365) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        const cookieValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
        return cookieValue ? decodeURIComponent(cookieValue[2]) : null;
    }
});

// Section: Delete All Cookies Button
const deleteCookiesButton = document.getElementById("delete_cookies_button");

deleteCookiesButton.addEventListener("click", () => {
    const confirmDelete = confirm("Do you want to delete all cookies? Deleting cookies will also delete all expense entries.");

    if (confirmDelete) {
        // Clear all cookies for this application
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        // Reload the page to reflect the changes (you can implement this differently if needed)
        location.reload();
    }
});

// Call calculateTotalExpense initially to display the total expense on page load
calculateTotalExpense();