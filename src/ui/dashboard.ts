export function renderDashboardUI(container: HTMLElement) {
    function updateView() {
        container.innerHTML = `
            <div class="view-container fade-in">
                <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h1>Dispatcher Command</h1>
                    <div style="display: flex; gap: 16px;">
                        <span class="glass-card" style="padding: 10px 20px;">Live Reports: <strong>24</strong></span>
                        <span class="glass-card" style="padding: 10px 20px; border-color: var(--md-sys-color-error); color: var(--md-sys-color-error)">Alerts: <strong>2</strong></span>
                    </div>
                </header>

                <div class="bento-grid">
                    <div class="bento-item large glass-card" style="height: 400px; background: #2f3033; color: white;">
                        <h3>Real-time Triage Map</h3>
                        <div style="height: 300px; background: #444; border-radius: 12px; margin-top: 16px; display: flex; align-items: center; justify-content: center;">
                            <p>Interactive Map Simulation (PostGIS Heatmap)</p>
                        </div>
                    </div>
                    
                    <div class="bento-item glass-card" style="border-left: 4px solid var(--md-sys-color-error);">
                        <div style="display: flex; justify-content: space-between;">
                            <h3>🚨 Red Alert</h3>
                            <button class="btn-primary" style="padding: 4px 12px; font-size: 12px;">Active</button>
                        </div>
                        <p><strong>Infrastructure:</strong> 12 reports in Sector 7G.</p>
                        <p style="font-style: italic; opacity: 0.8;">"Large water main burst detected near Main St. Flooding reported across 3 blocks."</p>
                    </div>

                    <div class="bento-item glass-card">
                        <h3>Recent Activity</h3>
                        <ul style="list-style: none; padding: 0; margin-top: 16px;">
                            <li style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.1)">
                                🟢 <strong>Safety:</strong> Abandoned vehicle (2m ago)
                            </li>
                             <li style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.1)">
                                🔌 <strong>Energy:</strong> Street light flickering (10m ago)
                            </li>
                            <li>
                                🚧 <strong>Roads:</strong> Pothole detected (15m ago)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    updateView();
}
