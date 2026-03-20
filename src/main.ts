import './ui/styles.css';
import { renderCitizenUI } from './ui/citizen';
import { renderDashboardUI } from './ui/dashboard';

console.log('CivicSignal Application Initialized');

const app = document.getElementById('app');
const nav = document.createElement('nav');

nav.style.cssText = `
    display: flex; 
    justify-content: center; 
    gap: 20px; 
    padding: 20px; 
    background: var(--md-sys-color-surface-container);
    position: sticky;
    top: 0;
    z-index: 100;
`;

nav.innerHTML = `
    <button class="btn-primary" id="view-citizen" style="background: transparent; color: var(--md-sys-color-primary);">Citizen App</button>
    <button class="btn-primary" id="view-dashboard" style="background: transparent; color: var(--md-sys-color-primary);">Dispatcher Dashboard</button>
`;

if (app) {
    document.body.prepend(nav);
    const container = document.createElement('div');
    container.id = 'view-content';
    app.appendChild(container);

    const showCitizen = () => {
        renderCitizenUI(container);
        updateNav('view-citizen');
    };

    const showDashboard = () => {
        renderDashboardUI(container);
        updateNav('view-dashboard');
    };

    const updateNav = (id: string) => {
        nav.querySelectorAll('button').forEach(b => {
            b.style.background = b.id === id ? 'var(--md-sys-color-primary)' : 'transparent';
            b.style.color = b.id === id ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)';
        });
    };

    document.getElementById('view-citizen')?.addEventListener('click', showCitizen);
    document.getElementById('view-dashboard')?.addEventListener('click', showDashboard);

    // Initial view
    showCitizen();
}
