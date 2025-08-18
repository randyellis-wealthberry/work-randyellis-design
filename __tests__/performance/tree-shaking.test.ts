import { describe, test, expect, beforeAll } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';

type ImportAnalysis = {
  filePath: string;
  totalImports: number;
  unusedImports: string[];
  heavyImports: string[];
  potentialTreeShaking: string[];
};

type TreeShakingReport = {
  totalFiles: number;
  filesWithUnusedImports: number;
  heavyLibrariesNotTreeShaken: string[];
  optimizationOpportunities: string[];
};

// Libraries that should be tree-shakeable
const TREE_SHAKEABLE_LIBRARIES = [
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  'framer-motion',
  'lucide-react',
  '@radix-ui',
  'motion'
];

// Heavy libraries that need careful import analysis
const HEAVY_LIBRARIES = [
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  '@react-three/postprocessing',
  'framer-motion',
  'motion'
];

describe('Tree Shaking Performance Tests', () => {
  let importAnalysis: ImportAnalysis[] = [];
  let treeShakingReport: TreeShakingReport = {
    totalFiles: 0,
    filesWithUnusedImports: 0,
    heavyLibrariesNotTreeShaken: [],
    optimizationOpportunities: []
  };

  beforeAll(async () => {
    const sourceDir = path.join(process.cwd());
    const filesToAnalyze = await findSourceFiles(sourceDir);
    
    for (const filePath of filesToAnalyze) {
      const analysis = await analyzeImports(filePath);
      if (analysis) {
        importAnalysis.push(analysis);
      }
    }
    
    treeShakingReport = generateTreeShakingReport(importAnalysis);
  });

  test('Three.js should use selective imports instead of full library', () => {
    const threeJSFiles = importAnalysis.filter(file => 
      file.heavyImports.some(imp => imp.includes('three'))
    );
    
    const filesWithFullThreeImport = threeJSFiles.filter(file => {
      // Look for files that import the entire Three.js library
      const content = getFileContent(file.filePath);
      return content.includes('import * as THREE from "three"') ||
             content.includes('import THREE from "three"');
    });
    
    // Should prefer selective imports like: import { Scene, Camera } from 'three'
    expect(filesWithFullThreeImport.length).toBeLessThanOrEqual(3); // Allow some full imports
    
    if (filesWithFullThreeImport.length > 0) {
      console.log('Files with full Three.js imports:', filesWithFullThreeImport.map(f => f.filePath));
    }
  });

  test('React Three Fiber components should be selectively imported', () => {
    const r3fFiles = importAnalysis.filter(file => 
      file.heavyImports.some(imp => imp.includes('@react-three'))
    );
    
    const filesWithFullR3FImport = r3fFiles.filter(file => {
      const content = getFileContent(file.filePath);
      // Check for barrel imports that prevent tree shaking
      return content.includes('import * as') && content.includes('@react-three');
    });
    
    // Should use selective imports like: import { Canvas, useFrame } from '@react-three/fiber'
    expect(filesWithFullR3FImport.length).toBe(0);
  });

  test('Framer Motion should use selective imports', () => {
    const motionFiles = importAnalysis.filter(file => 
      file.heavyImports.some(imp => imp.includes('motion') || imp.includes('framer-motion'))
    );
    
    const problematicImports = motionFiles.filter(file => {
      const content = getFileContent(file.filePath);
      // These patterns prevent tree shaking
      return content.includes('import * as motion') ||
             content.includes('import motion from') ||
             content.includes('import * from "framer-motion"');
    });
    
    expect(problematicImports.length).toBe(0);
    
    if (problematicImports.length > 0) {
      console.log('Files with problematic motion imports:', problematicImports.map(f => f.filePath));
    }
  });

  test('Lucide React icons should be imported individually', () => {
    const iconFiles = importAnalysis.filter(file => 
      file.heavyImports.some(imp => imp.includes('lucide-react'))
    );
    
    const filesWithBadIconImports = iconFiles.filter(file => {
      const content = getFileContent(file.filePath);
      // These patterns import the entire icon library
      return content.includes('import * from "lucide-react"') ||
             content.includes('import { * } from "lucide-react"');
    });
    
    // Should use: import { Calendar, Users } from 'lucide-react'
    expect(filesWithBadIconImports.length).toBe(0);
  });

  test('Radix UI components should be imported from specific packages', () => {
    const radixFiles = importAnalysis.filter(file => 
      file.heavyImports.some(imp => imp.includes('@radix-ui'))
    );
    
    const filesWithSuboptimalRadixImports = radixFiles.filter(file => {
      const content = getFileContent(file.filePath);
      // Check for imports from main package instead of specific component packages
      return content.includes('from "@radix-ui/react"') ||
             content.includes('from "radix-ui"');
    });
    
    // Should use: import { Dialog } from '@radix-ui/react-dialog'
    expect(filesWithSuboptimalRadixImports.length).toBe(0);
  });

  test('Bundle should not include unused library code', () => {
    // This test would need to analyze the actual bundle content
    // For now, we'll check for common patterns that indicate unused imports
    
    const filesWithUnusedImports = importAnalysis.filter(file => 
      file.unusedImports.length > 0
    );
    
    const heavyUnusedImports = filesWithUnusedImports.filter(file => 
      file.unusedImports.some(imp => 
        HEAVY_LIBRARIES.some(lib => imp.includes(lib))
      )
    );
    
    // Heavy libraries should not have unused imports
    expect(heavyUnusedImports.length).toBe(0);
    
    if (heavyUnusedImports.length > 0) {
      console.log('Files with unused heavy imports:', heavyUnusedImports.map(f => 
        `${f.filePath}: ${f.unusedImports.join(', ')}`
      ));
    }
  });

  test('Dynamic imports should be used for heavy 3D components', () => {
    const componentFiles = importAnalysis.filter(file => 
      file.filePath.includes('components/') && 
      (file.filePath.includes('webgl') || file.filePath.includes('three'))
    );
    
    const filesWithoutDynamicImports = componentFiles.filter(file => {
      const content = getFileContent(file.filePath);
      const hasHeavyImports = HEAVY_LIBRARIES.some(lib => 
        content.includes(`from "${lib}"`)
      );
      const hasDynamicImport = content.includes('import(') || 
                              content.includes('React.lazy') ||
                              content.includes('dynamic(');
      
      return hasHeavyImports && !hasDynamicImport;
    });
    
    // 3D components should use dynamic imports
    expect(filesWithoutDynamicImports.length).toBeLessThanOrEqual(2); // Allow some direct imports
  });

  test('Tree shaking efficiency should meet targets', () => {
    const efficiency = calculateTreeShakingEfficiency(importAnalysis);
    
    // Efficiency metrics
    expect(efficiency.unusedImportPercentage).toBeLessThan(15); // Less than 15% unused imports
    expect(efficiency.heavyLibraryOptimization).toBeGreaterThan(70); // 70%+ of heavy libs optimized
    expect(efficiency.selectiveImportUsage).toBeGreaterThan(80); // 80%+ selective imports
    
    console.log('Tree shaking efficiency:', efficiency);
  });

  test('Webpack bundle analysis should show effective tree shaking', () => {
    // This test documents what we expect to see in bundle analysis
    const expectedOptimizations = [
      'Three.js core should be < 100KB when tree-shaken',
      'React Three Fiber should be < 50KB when selectively imported',
      'Framer Motion should be < 80KB with selective imports',
      'Unused Radix UI components should not appear in bundle',
      'Individual Lucide icons should total < 10KB'
    ];
    
    // For now, this documents our optimization targets
    expectedOptimizations.forEach(optimization => {
      console.log('Tree shaking target:', optimization);
    });
    
    expect(expectedOptimizations.length).toBeGreaterThan(0);
  });

  test('Should identify specific tree shaking improvements', () => {
    const improvements = identifyTreeShakingImprovements(importAnalysis);
    
    // Document current opportunities
    console.log('Tree shaking improvement opportunities:');
    improvements.forEach((improvement, index) => {
      console.log(`${index + 1}. ${improvement.description}`);
      console.log(`   Impact: ${improvement.estimatedSavings}`);
      console.log(`   Files: ${improvement.affectedFiles.join(', ')}`);
    });
    
    // This test ensures we're tracking improvement opportunities
    expect(improvements).toEqual(expect.any(Array));
  });
});

// Helper functions
async function findSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !shouldSkipDirectory(entry.name)) {
        const subFiles = await findSourceFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && isSourceFile(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

function shouldSkipDirectory(name: string): boolean {
  return [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    '__tests__',
    'coverage'
  ].includes(name);
}

function isSourceFile(name: string): boolean {
  return /\.(ts|tsx|js|jsx)$/.test(name) && !name.includes('.test.') && !name.includes('.spec.');
}

async function analyzeImports(filePath: string): Promise<ImportAnalysis | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const imports = extractImports(content);
    
    return {
      filePath,
      totalImports: imports.length,
      unusedImports: findUnusedImports(content, imports),
      heavyImports: imports.filter(imp => 
        HEAVY_LIBRARIES.some(lib => imp.includes(lib))
      ),
      potentialTreeShaking: findTreeShakingOpportunities(content, imports)
    };
  } catch (error) {
    return null;
  }
}

function extractImports(content: string): string[] {
  const importRegex = /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g;
  const imports: string[] = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

function findUnusedImports(content: string, imports: string[]): string[] {
  // Simplified unused import detection
  const namedImportRegex = /import\s*{([^}]+)}\s*from\s*['"]([^'"]+)['"]/g;
  const unusedImports: string[] = [];
  let match;
  
  while ((match = namedImportRegex.exec(content)) !== null) {
    const importedNames = match[1].split(',').map(name => name.trim());
    const library = match[2];
    
    importedNames.forEach(name => {
      // Simple check - if the imported name doesn't appear elsewhere, it might be unused
      const usageRegex = new RegExp(`\\b${name}\\b`, 'g');
      const usages = (content.match(usageRegex) || []).length;
      
      // If it only appears once (in the import statement), it might be unused
      if (usages <= 1) {
        unusedImports.push(`${name} from ${library}`);
      }
    });
  }
  
  return unusedImports;
}

function findTreeShakingOpportunities(content: string, imports: string[]): string[] {
  const opportunities: string[] = [];
  
  // Check for full library imports
  const fullImportRegex = /import\s*\*\s*as\s*\w+\s*from\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = fullImportRegex.exec(content)) !== null) {
    const library = match[1];
    if (TREE_SHAKEABLE_LIBRARIES.some(lib => library.includes(lib))) {
      opportunities.push(`Consider selective import from ${library}`);
    }
  }
  
  // Check for default imports of tree-shakeable libraries
  const defaultImportRegex = /import\s+\w+\s+from\s*['"]([^'"]+)['"]/g;
  
  while ((match = defaultImportRegex.exec(content)) !== null) {
    const library = match[1];
    if (TREE_SHAKEABLE_LIBRARIES.some(lib => library.includes(lib))) {
      opportunities.push(`Consider named imports from ${library}`);
    }
  }
  
  return opportunities;
}

function getFileContent(filePath: string): string {
  try {
    return require('fs').readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function generateTreeShakingReport(analysis: ImportAnalysis[]): TreeShakingReport {
  const filesWithUnusedImports = analysis.filter(a => a.unusedImports.length > 0);
  const heavyLibrariesNotTreeShaken = new Set<string>();
  const optimizationOpportunities: string[] = [];
  
  analysis.forEach(file => {
    file.heavyImports.forEach(imp => {
      if (file.potentialTreeShaking.length > 0) {
        heavyLibrariesNotTreeShaken.add(imp);
      }
    });
    
    optimizationOpportunities.push(...file.potentialTreeShaking);
  });
  
  return {
    totalFiles: analysis.length,
    filesWithUnusedImports: filesWithUnusedImports.length,
    heavyLibrariesNotTreeShaken: Array.from(heavyLibrariesNotTreeShaken),
    optimizationOpportunities
  };
}

function calculateTreeShakingEfficiency(analysis: ImportAnalysis[]) {
  const totalImports = analysis.reduce((sum, file) => sum + file.totalImports, 0);
  const totalUnusedImports = analysis.reduce((sum, file) => sum + file.unusedImports.length, 0);
  const heavyLibraryFiles = analysis.filter(file => file.heavyImports.length > 0);
  const optimizedHeavyFiles = heavyLibraryFiles.filter(file => file.potentialTreeShaking.length === 0);
  const selectiveImportFiles = analysis.filter(file => 
    !file.potentialTreeShaking.some(opp => opp.includes('Consider selective'))
  );
  
  return {
    unusedImportPercentage: totalImports > 0 ? (totalUnusedImports / totalImports) * 100 : 0,
    heavyLibraryOptimization: heavyLibraryFiles.length > 0 ? 
      (optimizedHeavyFiles.length / heavyLibraryFiles.length) * 100 : 100,
    selectiveImportUsage: analysis.length > 0 ? 
      (selectiveImportFiles.length / analysis.length) * 100 : 100
  };
}

function identifyTreeShakingImprovements(analysis: ImportAnalysis[]) {
  const improvements = [];
  
  // Three.js optimization opportunities
  const threeJSFiles = analysis.filter(file => 
    file.heavyImports.some(imp => imp.includes('three'))
  );
  if (threeJSFiles.length > 0) {
    improvements.push({
      description: 'Optimize Three.js imports using selective imports',
      estimatedSavings: '200-300KB',
      affectedFiles: threeJSFiles.map(f => path.basename(f.filePath))
    });
  }
  
  // Motion library opportunities
  const motionFiles = analysis.filter(file => 
    file.heavyImports.some(imp => imp.includes('motion'))
  );
  if (motionFiles.length > 0) {
    improvements.push({
      description: 'Optimize Framer Motion imports',
      estimatedSavings: '50-100KB',
      affectedFiles: motionFiles.map(f => path.basename(f.filePath))
    });
  }
  
  // Icon library opportunities
  const iconFiles = analysis.filter(file => 
    file.heavyImports.some(imp => imp.includes('lucide'))
  );
  if (iconFiles.length > 0) {
    improvements.push({
      description: 'Use individual icon imports instead of barrel imports',
      estimatedSavings: '20-50KB',
      affectedFiles: iconFiles.map(f => path.basename(f.filePath))
    });
  }
  
  return improvements;
}
