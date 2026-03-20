import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderCitizenUI } from '../ui/citizen';

describe('Citizen UI Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render the initial 3-tap flow Step 1', () => {
    renderCitizenUI(container);
    expect(container.innerHTML).toContain("What's the issue?");
    expect(container.querySelectorAll('.category-item').length).toBeGreaterThan(0);
  });

  it('should transition to Step 2 when a category is clicked', () => {
    renderCitizenUI(container);
    const firstCategory = container.querySelector('.category-item') as HTMLElement;
    firstCategory.click();
    
    expect(container.innerHTML).toContain('Location Check');
    expect(container.innerHTML).toContain('Simulating GPS Accuracy');
  });

  it('should transition to Step 3 (Final Details) when Confirm Location is clicked', () => {
    renderCitizenUI(container);
    // Tap Step 1
    (container.querySelector('.category-item') as HTMLElement).click();
    // Tap Step 2
    const confirmBtn = container.querySelector('#next-step') as HTMLElement;
    confirmBtn.click();
    
    expect(container.innerHTML).toContain('Final Details');
    expect(container.querySelector('#description')).toBeDefined();
  });

  it('should show Success screen when report is submitted', async () => {
    renderCitizenUI(container);
    // Tap Step 1
    (container.querySelector('.category-item') as HTMLElement).click();
    // Tap Step 2
    (container.querySelector('#next-step') as HTMLElement).click();
    // Tap Step 3
    const submitBtn = container.querySelector('#submit-report') as HTMLElement;
    submitBtn.click();
    
    expect(container.innerHTML).toContain('Report Submitted!');
    expect(container.innerHTML).toContain('Thank you');
  });
});
