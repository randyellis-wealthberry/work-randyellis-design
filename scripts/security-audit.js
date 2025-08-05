#!/usr/bin/env node

/**
 * Security Audit Script
 * 
 * Comprehensive security and compliance audit for the portfolio site.
 * Checks for vulnerabilities, compliance issues, and security best practices.
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
  constructor() {
    this.results = {
      vulnerabilities: [],
      compliance: [],
      security: [],
      recommendations: [],
      score: 0
    };
  }

  async runAudit() {
    console.log('🔍 Starting Security and Compliance Audit...\n');

    await this.checkDependencyVulnerabilities();
    await this.checkSecurityHeaders();
    await this.checkPrivacyCompliance();
    await this.checkDataHandling();
    await this.checkAPIEndpoints();
    await this.checkContentSecurity();
    await this.checkAccessibility();
    
    this.calculateScore();
    this.generateReport();
  }

  async checkDependencyVulnerabilities() {
    console.log('📦 Checking dependency vulnerabilities...');
    
    try {
      // Run npm audit
      const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditResult);
      
      if (audit.metadata.vulnerabilities.total > 0) {
        this.results.vulnerabilities.push({
          type: 'Dependencies',
          severity: 'high',
          count: audit.metadata.vulnerabilities.total,
          message: `Found ${audit.metadata.vulnerabilities.total} vulnerabilities`,
          action: 'Run npm audit fix to resolve'
        });
      } else {
        this.results.security.push({
          type: 'Dependencies',
          status: 'pass',
          message: 'No known vulnerabilities found'
        });
      }
    } catch (error) {
      this.results.vulnerabilities.push({
        type: 'Dependencies',
        severity: 'medium',
        message: 'Unable to run dependency audit',
        action: 'Manually review package.json for outdated packages'
      });
    }
  }

  async checkSecurityHeaders() {
    console.log('🛡️ Checking security headers implementation...');
    
    try {
      const middlewareContent = await fs.readFile(path.join(process.cwd(), 'middleware.ts'), 'utf8');
      const securityHeadersContent = await fs.readFile(path.join(process.cwd(), 'lib/security-headers.ts'), 'utf8');
      
      const requiredHeaders = [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Strict-Transport-Security'
      ];
      
      const missingHeaders = requiredHeaders.filter(header => 
        !securityHeadersContent.includes(header)
      );
      
      if (missingHeaders.length > 0) {
        this.results.security.push({
          type: 'Security Headers',
          status: 'warning',
          message: `Missing headers: ${missingHeaders.join(', ')}`,
          action: 'Add missing security headers'
        });
      } else {
        this.results.security.push({
          type: 'Security Headers',
          status: 'pass',
          message: 'All required security headers implemented'
        });
      }
      
      // Check CSP configuration
      if (securityHeadersContent.includes("'unsafe-inline'")) {
        this.results.recommendations.push({
          type: 'CSP',
          message: 'Consider removing unsafe-inline from CSP for better security',
          priority: 'medium'
        });
      }
      
    } catch (error) {
      this.results.vulnerabilities.push({
        type: 'Security Headers',
        severity: 'high',
        message: 'Security headers not properly configured',
        action: 'Implement security headers middleware'
      });
    }
  }

  async checkPrivacyCompliance() {
    console.log('🔒 Checking privacy and GDPR compliance...');
    
    const requiredPages = [
      'app/privacy-policy/page.tsx',
      'app/terms-of-service/page.tsx'
    ];
    
    const requiredComponents = [
      'components/ui/cookie-consent.tsx'
    ];
    
    for (const page of requiredPages) {
      try {
        await fs.access(path.join(process.cwd(), page));
        this.results.compliance.push({
          type: 'Legal Pages',
          status: 'pass',
          message: `${page} exists`
        });
      } catch {
        this.results.compliance.push({
          type: 'Legal Pages',
          status: 'fail',
          message: `Missing required page: ${page}`,
          action: 'Create required legal page'
        });
      }
    }
    
    for (const component of requiredComponents) {
      try {
        await fs.access(path.join(process.cwd(), component));
        this.results.compliance.push({
          type: 'Privacy Components',
          status: 'pass',
          message: `${component} exists`
        });
      } catch {
        this.results.compliance.push({
          type: 'Privacy Components',
          status: 'fail',
          message: `Missing required component: ${component}`,
          action: 'Implement cookie consent component'
        });
      }
    }
  }

  async checkDataHandling() {
    console.log('📊 Checking data handling practices...');
    
    try {
      const emailStorageContent = await fs.readFile(path.join(process.cwd(), 'lib/email-storage.ts'), 'utf8');
      const newsletterAPIContent = await fs.readFile(path.join(process.cwd(), 'app/api/newsletter/subscribe/route.ts'), 'utf8');
      
      // Check for GDPR consent handling
      if (emailStorageContent.includes('gdprConsent') && newsletterAPIContent.includes('consent')) {
        this.results.compliance.push({
          type: 'Data Consent',
          status: 'pass',
          message: 'GDPR consent handling implemented'
        });
      } else {
        this.results.compliance.push({
          type: 'Data Consent',
          status: 'fail',
          message: 'GDPR consent handling not properly implemented',
          action: 'Add explicit consent handling'
        });
      }
      
      // Check for data subject rights API
      try {
        await fs.access(path.join(process.cwd(), 'app/api/data-request/route.ts'));
        this.results.compliance.push({
          type: 'Data Subject Rights',
          status: 'pass',
          message: 'Data subject rights API implemented'
        });
      } catch {
        this.results.compliance.push({
          type: 'Data Subject Rights',
          status: 'fail',
          message: 'Missing data subject rights API',
          action: 'Implement GDPR data request API'
        });
      }
      
    } catch (error) {
      this.results.compliance.push({
        type: 'Data Handling',
        status: 'fail',
        message: 'Data handling implementation not found',
        action: 'Review data storage and processing practices'
      });
    }
  }

  async checkAPIEndpoints() {
    console.log('🔌 Checking API endpoint security...');
    
    try {
      const middlewareContent = await fs.readFile(path.join(process.cwd(), 'middleware.ts'), 'utf8');
      
      // Check for rate limiting
      if (middlewareContent.includes('RATE_LIMIT_CONFIG')) {
        this.results.security.push({
          type: 'Rate Limiting',
          status: 'pass',
          message: 'Rate limiting implemented'
        });
      } else {
        this.results.security.push({
          type: 'Rate Limiting',
          status: 'fail',
          message: 'Rate limiting not implemented',
          action: 'Add rate limiting to API endpoints'
        });
      }
      
      // Check for input validation
      const apiFiles = await this.findAPIFiles();
      let hasValidation = false;
      
      for (const file of apiFiles) {
        const content = await fs.readFile(file, 'utf8');
        if (content.includes('zod') || content.includes('joi') || content.includes('validator')) {
          hasValidation = true;
          break;
        }
      }
      
      if (hasValidation) {
        this.results.security.push({
          type: 'Input Validation',
          status: 'pass',
          message: 'Input validation implemented'
        });
      } else {
        this.results.security.push({
          type: 'Input Validation',
          status: 'warning',
          message: 'Limited input validation found',
          action: 'Implement comprehensive input validation'
        });
      }
      
    } catch (error) {
      this.results.security.push({
        type: 'API Security',
        status: 'fail',
        message: 'Unable to assess API security',
        action: 'Manual review of API endpoints required'
      });
    }
  }

  async checkContentSecurity() {
    console.log('📝 Checking content security...');
    
    try {
      // Check for XSS protection in components
      const componentFiles = await this.findComponentFiles();
      let hasDangerousHTML = false;
      
      for (const file of componentFiles) {
        const content = await fs.readFile(file, 'utf8');
        if (content.includes('dangerouslySetInnerHTML') && !content.includes('sanitize')) {
          hasDangerousHTML = true;
          this.results.vulnerabilities.push({
            type: 'XSS Risk',
            severity: 'medium',
            message: `Potential XSS risk in ${path.basename(file)}`,
            action: 'Review and sanitize HTML content'
          });
        }
      }
      
      if (!hasDangerousHTML) {
        this.results.security.push({
          type: 'XSS Protection',
          status: 'pass',
          message: 'No obvious XSS vulnerabilities found'
        });
      }
      
    } catch (error) {
      this.results.security.push({
        type: 'Content Security',
        status: 'warning',
        message: 'Unable to fully assess content security',
        action: 'Manual code review recommended'
      });
    }
  }

  async checkAccessibility() {
    console.log('♿ Checking accessibility compliance...');
    
    try {
      const layoutContent = await fs.readFile(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
      
      // Check for proper HTML structure
      if (layoutContent.includes('lang="en"')) {
        this.results.compliance.push({
          type: 'Accessibility',
          status: 'pass',
          message: 'HTML lang attribute present'
        });
      } else {
        this.results.compliance.push({
          type: 'Accessibility',
          status: 'fail',
          message: 'Missing HTML lang attribute',
          action: 'Add lang attribute to HTML element'
        });
      }
      
      // Check for viewport meta tag
      if (layoutContent.includes('viewport')) {
        this.results.compliance.push({
          type: 'Accessibility',
          status: 'pass',
          message: 'Viewport meta tag present'
        });
      }
      
    } catch (error) {
      this.results.compliance.push({
        type: 'Accessibility',
        status: 'warning',
        message: 'Unable to assess accessibility',
        action: 'Run accessibility audit tools'
      });
    }
  }

  async findAPIFiles() {
    const apiDir = path.join(process.cwd(), 'app/api');
    const files = [];
    
    try {
      const entries = await fs.readdir(apiDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const routeFile = path.join(apiDir, entry.name, 'route.ts');
          try {
            await fs.access(routeFile);
            files.push(routeFile);
          } catch {}
        }
      }
    } catch {}
    
    return files;
  }

  async findComponentFiles() {
    const componentDir = path.join(process.cwd(), 'components');
    const files = [];
    
    try {
      const walk = async (dir) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await walk(fullPath);
          } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
            files.push(fullPath);
          }
        }
      };
      
      await walk(componentDir);
    } catch {}
    
    return files;
  }

  calculateScore() {
    const passCount = this.results.security.filter(r => r.status === 'pass').length +
                     this.results.compliance.filter(r => r.status === 'pass').length;
    
    const totalChecks = this.results.security.length + this.results.compliance.length;
    const vulnerabilityPenalty = this.results.vulnerabilities.length * 10;
    
    this.results.score = Math.max(0, Math.round((passCount / totalChecks) * 100) - vulnerabilityPenalty);
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 SECURITY & COMPLIANCE AUDIT REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📊 Overall Score: ${this.results.score}/100`);
    
    if (this.results.vulnerabilities.length > 0) {
      console.log('\n🚨 VULNERABILITIES:');
      this.results.vulnerabilities.forEach(vuln => {
        console.log(`  • [${vuln.severity.toUpperCase()}] ${vuln.type}: ${vuln.message}`);
        if (vuln.action) console.log(`    Action: ${vuln.action}`);
      });
    }
    
    if (this.results.compliance.filter(c => c.status === 'fail').length > 0) {
      console.log('\n❌ COMPLIANCE ISSUES:');
      this.results.compliance.filter(c => c.status === 'fail').forEach(issue => {
        console.log(`  • ${issue.type}: ${issue.message}`);
        if (issue.action) console.log(`    Action: ${issue.action}`);
      });
    }
    
    if (this.results.security.filter(s => s.status === 'fail').length > 0) {
      console.log('\n🛡️ SECURITY ISSUES:');
      this.results.security.filter(s => s.status === 'fail').forEach(issue => {
        console.log(`  • ${issue.type}: ${issue.message}`);
        if (issue.action) console.log(`    Action: ${issue.action}`);
      });
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => {
        console.log(`  • [${rec.priority.toUpperCase()}] ${rec.type}: ${rec.message}`);
      });
    }
    
    const passedChecks = this.results.security.filter(s => s.status === 'pass').length +
                        this.results.compliance.filter(c => c.status === 'pass').length;
    
    if (passedChecks > 0) {
      console.log('\n✅ PASSING CHECKS:');
      [...this.results.security, ...this.results.compliance]
        .filter(check => check.status === 'pass')
        .forEach(check => {
          console.log(`  • ${check.type}: ${check.message}`);
        });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Audit completed. Review issues above and implement fixes.');
    console.log('='.repeat(60));
  }
}

// Run the audit
const auditor = new SecurityAuditor();
auditor.runAudit().catch(console.error);