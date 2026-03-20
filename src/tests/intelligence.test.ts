import { describe, it, expect, vi, beforeEach } from 'vitest';
import { summarizeIssues } from '../services/intelligence';
import { Report } from '../services/reports';

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent
    })
  }))
}));

describe('Intelligence Service (Gemini Summarization)', () => {
  const mockReports: Report[] = [
    {
      id: '1',
      lat: 40.7128,
      lng: -74.006,
      categoryId: 'infrastructure',
      description: 'Water main burst on Main St',
      created_at: new Date()
    },
    {
      id: '2',
      lat: 40.7138,
      lng: -74.007,
      categoryId: 'safety',
      description: 'Gas leak reported near the park',
      created_at: new Date()
    }
  ];

  it('should return a summary of reported issues', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'The reports indicate an infrastructure issue (water main burst) and a safety concern (gas leak).'
      }
    });

    const summary = await summarizeIssues(mockReports);
    expect(summary).toContain('infrastructure issue');
    expect(summary).toContain('safety concern');
  });

  it('should handle empty reports list', async () => {
    const summary = await summarizeIssues([]);
    expect(summary).toBe('No reports available for summarization.');
  });

  it('should provide a fallback summary on API error', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Error'));

    const summary = await summarizeIssues(mockReports);
    expect(summary).toBe('Summary unavailable (AI service error).');
  });
});
