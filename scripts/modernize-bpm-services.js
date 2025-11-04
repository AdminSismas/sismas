const fs = require('fs');
const path = require('path');

const servicesDir = 'src/app/features/bpm-workflows/services';

const servicesToModernize = [
  'attachment.service.ts',
  'bpm-flow.service.ts',
  'bpm-process.service.ts',
  'bpm-task.service.ts',
  'bpm-workflow-facade.service.ts',
  'information-person.service.ts',
  'participants-service.service.ts',
  'rrright.service.ts',
  'sync-main.service.ts',
  'tasks-panel-facade.service.ts',
  'participants-process.service.ts',
  'recognition-property.service.ts',
  'res.service.ts',
  'dynamic-components.service.ts'
];

function modernizeService(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if already modernized
  if (content.includes('inject(HttpClient)') || !content.includes('constructor')) {
    console.log(`Skipping ${path.basename(filePath)} - already modernized or no constructor`);
    return false;
  }

  console.log(`Modernizing ${path.basename(filePath)}...`);

  // 1. Add inject to imports if not present
  if (!content.includes(', inject')) {
    content = content.replace(
      /from '@angular\/core';/,
      (match) => {
        if (content.includes("import { Injectable }")) {
          return match.replace("import { Injectable }", "import { Injectable, inject }");
        }
        return match;
      }
    );
    modified = true;
  }

  // 2. Add signal to imports if BehaviorSubject or ReplaySubject is present
  if ((content.includes('BehaviorSubject') || content.includes('ReplaySubject')) && !content.includes('signal')) {
    content = content.replace(
      /import \{ Injectable(.*?) \} from '@angular\/core';/,
      'import { Injectable$1, signal } from \'@angular/core\';'
    );
    modified = true;
  }

  // 3. Replace constructor with inject - handle various patterns
  // Pattern: constructor(private http: HttpClient) {}
  content = content.replace(
    /constructor\(\s*private\s+http:\s*HttpClient\s*\)\s*\{\s*\}/g,
    'private http = inject(HttpClient);'
  );

  // Pattern: constructor(private http: HttpClient, ...) {...}
  content = content.replace(
    /constructor\(\s*private\s+http:\s*HttpClient\s*,([^)]+)\)\s*\{[^}]*\}/gs,
    (match, otherParams) => {
      const cleanParams = otherParams.trim();
      if (cleanParams) {
        // Extract other injections
        const injections = cleanParams.split(',').map(param => {
          const trimmed = param.trim();
          const privateMatch = trimmed.match(/private\s+(\w+):\s*(\w+)/);
          if (privateMatch) {
            return `private ${privateMatch[1]} = inject(${privateMatch[2]});`;
          }
          return null;
        }).filter(Boolean);

        return `private http = inject(HttpClient);\n  ${injections.join('\n  ')}`;
      }
      return 'private http = inject(HttpClient);';
    }
  );

  // 4. Replace BehaviorSubject with signal
  content = content.replace(
    /private\s+(\w+)\s*=\s*new\s+BehaviorSubject<([^>]+)>\(([^)]+)\);/g,
    'private $1 = signal<$2>($3);'
  );

  // 5. Replace ReplaySubject with signal
  content = content.replace(
    /private\s+(\w+)\s*=\s*new\s+ReplaySubject<([^>]+)>\(([^)]+)\);/g,
    'private $1 = signal<$2 | null>(null);'
  );

  // 6. Replace .next() with .set()
  content = content.replace(/\.next\(/g, '.set(');

  // 7. Replace .asObservable() with toObservable()
  if (content.includes('.asObservable()')) {
    content = content.replace(/(\w+)\$\s*=\s*this\.(\w+)\.asObservable\(\);/g, '$1$ = toObservable(this.$2);');

    // Add toObservable import if needed
    if (!content.includes('toObservable')) {
      content = content.replace(
        /(import.*?from 'rxjs';)/,
        "$1\nimport { toObservable } from '@angular/core/rxjs-interop';"
      );
    }
    modified = true;
  }

  // 8. Clean up BehaviorSubject/ReplaySubject imports if replaced
  if (content.includes('signal<') && (content.includes('BehaviorSubject') || content.includes('ReplaySubject'))) {
    content = content.replace(/,?\s*BehaviorSubject/g, '');
    content = content.replace(/,?\s*ReplaySubject/g, '');
    // Clean up empty imports or trailing commas
    content = content.replace(/import\s*\{\s*,/g, 'import {');
    content = content.replace(/,\s*\}/g, ' }');
    modified = true;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Modernized ${path.basename(filePath)}`);
  return true;
}

let count = 0;
servicesToModernize.forEach(service => {
  const filePath = path.join(servicesDir, service);
  if (fs.existsSync(filePath)) {
    if (modernizeService(filePath)) {
      count++;
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log(`\nModernized ${count} services successfully!`);
