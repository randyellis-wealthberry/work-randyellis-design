/**
 * Test for Selected Projects thumbnail display issue
 * This test specifically checks if GrowIt shows LedgerIQ thumbnail
 */

import { PROJECTS } from '@/app/data';

describe('Selected Projects Thumbnail Investigation', () => {
  test('should have correct project data mapping', () => {
    const ledgeriq = PROJECTS.find(p => p.id === 'ledgeriq');
    const growit = PROJECTS.find(p => p.id === 'project2'); // GrowIt has id "project2"
    
    expect(ledgeriq).toBeDefined();
    expect(growit).toBeDefined();
    
    // Verify GrowIt project data
    expect(growit?.name).toBe('GrowIt');
    expect(growit?.video).toBe('/projects/growit/growit-hero-video.mp4');
    expect(growit?.thumbnail).toBe('/projects/growit/hero-thumbnail.jpg');
    
    // Verify LedgerIQ project data
    expect(ledgeriq?.name).toBe('LedgerIQ');
    expect(ledgeriq?.video).toBe('/projects/ledgeriq/ledgeriq-glitch.mp4');
    expect(ledgeriq?.thumbnail).toBe('/projects/ledgeriq/ledgeriq-glitch.mp4');
    
    // Ensure they are different
    expect(growit?.thumbnail).not.toBe(ledgeriq?.thumbnail);
    expect(growit?.video).not.toBe(ledgeriq?.video);
  });
  
  test('should have unique project IDs', () => {
    const projectIds = PROJECTS.map(p => p.id);
    const uniqueIds = new Set(projectIds);
    
    expect(uniqueIds.size).toBe(projectIds.length);
  });
  
  test('should verify project file references exist conceptually', () => {
    const growit = PROJECTS.find(p => p.id === 'project2');
    const ledgeriq = PROJECTS.find(p => p.id === 'ledgeriq');
    
    // Check that the paths are well-formed
    expect(growit?.thumbnail).toMatch(/^\/projects\/growit\/.*\.(jpg|mp4)$/);
    expect(ledgeriq?.thumbnail).toMatch(/^\/projects\/ledgeriq\/.*\.(jpg|mp4)$/);
    
    // Check they reference different files
    expect(growit?.thumbnail).toBe('/projects/growit/hero-thumbnail.jpg');
    expect(ledgeriq?.thumbnail).toBe('/projects/ledgeriq/ledgeriq-glitch.mp4');
  });
  
  test('should check project order and indexing', () => {
    const projectsArray = PROJECTS;
    
    // Find projects by index to ensure no array confusion
    const ledgeriqIndex = projectsArray.findIndex(p => p.id === 'ledgeriq');
    const growitIndex = projectsArray.findIndex(p => p.id === 'project2');
    
    expect(ledgeriqIndex).toBeGreaterThanOrEqual(0);
    expect(growitIndex).toBeGreaterThanOrEqual(0);
    expect(ledgeriqIndex).not.toBe(growitIndex);
    
    console.log('LedgerIQ index:', ledgeriqIndex, 'name:', projectsArray[ledgeriqIndex]?.name);
    console.log('GrowIt index:', growitIndex, 'name:', projectsArray[growitIndex]?.name);
  });
});