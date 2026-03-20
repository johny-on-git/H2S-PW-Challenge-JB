import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderDashboardUI } from '../ui/dashboard';

describe('Dashboard UI Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render the dashboard header and live reports count', () => {
    renderDashboardUI(container);
    expect(container.innerHTML).toContain('Dispatcher Command');
    expect(container.innerHTML).toContain('Live Reports:');
  });

  it('should render the bento grid with map simulation', () => {
    renderDashboardUI(container);
    expect(container.querySelector('.bento-grid')).toBeDefined();
    expect(container.innerHTML).toContain('Real-time Triage Map');
  });

  it('should render a red alert card', () => {
    renderDashboardUI(container);
    expect(container.innerHTML).toContain('🚨 Red Alert');
    expect(container.innerHTML).toContain('Infrastructure:');
  });

  it('should render recent activity list', () => {
    renderDashboardUI(container);
    expect(container.innerHTML).toContain('Recent Activity');
    expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
  });
});
