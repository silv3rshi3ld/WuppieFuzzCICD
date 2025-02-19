// Add any additional JavaScript functionality here
console.log('Dashboard loaded');

// Example: Add event listener for bug details
const bugList = document.querySelector('ul');
bugList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    const bugId = event.target.textContent.trim();
    // Fetch and display bug details based on bugId
    console.log(`Displaying details for bug: ${bugId}`);
  }
});