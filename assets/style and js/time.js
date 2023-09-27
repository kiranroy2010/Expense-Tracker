function updateTimeAndDate() {
    const currentDate = new Date();

    // Get the current date, month, and year
    const day = currentDate.getDate().toString().padStart(2, '0');
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    // Get the current time
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // Format the date as "DD Month YYYY" (e.g., "01 Sept 2023")
    const formattedDate = `${day} ${month} ${year}`;

    // Format the time as "HH:MM:SS" 
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Display the date and time in the specified spans
    const dateElement = document.getElementById("current_date");
    const timeElement = document.getElementById("current_time");

    if (dateElement && timeElement) {
        dateElement.textContent = `Date: ${formattedDate}`;
        timeElement.textContent = `Time: ${formattedTime}`;
    }
}

// Update the time and date every second
setInterval(updateTimeAndDate, 1000);

// Initial call to set the time and date when the page loads
updateTimeAndDate();
