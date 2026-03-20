import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderDashboardUI } from '../ui/dashboard';
import { clearReports } from '../services/reports';

describe('Dashboard UI Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    clearReports();
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

  it('should render AI Insights card', async () => {
    renderDashboardUI(container);
    // Wait for the async loadSummary to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(container.innerHTML).toContain('AI Insights');
  });

  it('should show error message if AI insights fail to load', async () => {
    // Mock failure
    vi.mock('../services/intelligence', () => ({
      summarizeIssues: vi.fn().mockRejectedValue(new Error('AI Failure'))
    }));
    
    renderDashboardUI(container);
    
    // Wait for the async loadSummary to complete and update the DOM
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(container.innerHTML).toContain('Error loading insights.');
  });
});
