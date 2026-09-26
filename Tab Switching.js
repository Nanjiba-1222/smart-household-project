// Function to switch active tabs/sections
function switchTab(tabName) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(sec => sec.style.display = 'none');

  // Remove active class from all nav items
  const navItems = document.querySelectorAll('.nav-links li');
  navItems.forEach(item => item.classList.remove('active'));

  // Show current selected section & set active menu
  const activeSec = document.getElementById(`section-${tabName}`);
  const activeNav = document.getElementById(`nav-${tabName}`);

  if (activeSec) activeSec.style.display = 'block';
  if (activeNav) activeNav.classList.add('active');
}