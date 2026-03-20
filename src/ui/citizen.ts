import { CreateReportSchema } from '../lib/validations/report';

export function renderCitizenUI(container: HTMLElement) {
    let step = 1;
    let selectedCategory = '';

    const categories = [
        { slug: 'safety', name: 'Safety', icon: '🚨' },
        { slug: 'infrastructure', name: 'Roads', icon: '🚧' },
        { slug: 'water', name: 'Water', icon: '💧' },
        { slug: 'energy', name: 'Power', icon: '⚡' }
    ];

    function updateView() {
        container.innerHTML = `
            <div class="view-container fade-in">
                ${renderStep()}
            </div>
        `;
        attachListeners();
    }

    function renderStep() {
        if (step === 1) {
            return `
                <div class="glass-card">
                    <h2>What's the issue?</h2>
                    <p>Select a category to report an anomaly in your neighborhood.</p>
                    <div class="category-grid">
                        ${categories.map(c => `
                            <div class="category-item glass-card" data-slug="${c.slug}">
                                <span class="category-icon">${c.icon}</span>
                                <span>${c.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (step === 2) {
            return `
                <div class="glass-card">
                    <h2>Location Check</h2>
                    <div style="height: 200px; background: #eee; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 16px 0;">
                        <span style="font-size: 32px;">📍</span>
                        <p>Simulating GPS Accuracy (5m)...</p>
                    </div>
                    <p>Reporting <strong>${selectedCategory}</strong> at your current location.</p>
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button class="btn-primary" id="prev-step" style="background: var(--md-sys-color-secondary)">Back</button>
                        <button class="btn-primary" id="next-step" style="flex: 1">Confirm Location</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="glass-card">
                    <h2>Final Details</h2>
                    <textarea id="description" placeholder="Optional description..." style="width: 100%; height: 100px; border-radius: 12px; border: 1px solid var(--md-sys-color-outline); padding: 12px; margin: 16px 0;"></textarea>
                    <button class="btn-primary" id="submit-report" style="width: 100%">Submit Report</button>
                    <button class="btn-primary" id="cancel" style="background: transparent; color: var(--md-sys-color-primary); margin-top: 8px;">Cancel</button>
                </div>
            `;
        }
    }

    function attachListeners() {
        if (step === 1) {
            container.querySelectorAll('.category-item').forEach(item => {
                item.addEventListener('click', () => {
                    selectedCategory = item.getAttribute('data-slug') || '';
                    step = 2;
                    updateView();
                });
            });
        } else if (step === 2) {
            container.querySelector('#next-step')?.addEventListener('click', () => {
                step = 3;
                updateView();
            });
            container.querySelector('#prev-step')?.addEventListener('click', () => {
                step = 1;
                updateView();
            });
        } else if (step === 3) {
            container.querySelector('#submit-report')?.addEventListener('click', async () => {
                const desc = (container.querySelector('#description') as HTMLTextAreaElement).value;
                
                // Validate payload using Zod before "submitting"
                const payload = {
                    categoryId: '123e4567-e89b-12d3-a456-426614174000', // Mock UUID
                    latitude: 45.0, // Mock lat
                    longitude: -90.0, // Mock lon
                    description: desc
                };

                const valid = CreateReportSchema.safeParse(payload);
                if (valid.success) {
                    container.innerHTML = `
                        <div class="view-container fade-in">
                            <div class="glass-card" style="text-align: center;">
                                <span style="font-size: 64px;">✅</span>
                                <h2>Report Submitted!</h2>
                                <p>Thank you for helping keep the city safe. Your report has been triaged.</p>
                                <button class="btn-primary" id="reset">Report Another</button>
                            </div>
                        </div>
                    `;
                    container.querySelector('#reset')?.addEventListener('click', () => {
                        step = 1;
                        updateView();
                    });
                } else {
                    alert('Validation error: ' + JSON.stringify(valid.error.issues));
                }
            });
             container.querySelector('#cancel')?.addEventListener('click', () => {
                step = 1;
                updateView();
            });
        }
    }

    updateView();
}
