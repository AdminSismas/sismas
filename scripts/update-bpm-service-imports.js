const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/pages/pages/my-work/tasks/components/details-header/details-header.component.ts',
  'src/app/pages/pages/bpm/bpm-core/bpm-core.component.ts',
  'src/app/apps/components/bpm/header-bpm-core/header-bpm-core.component.ts',
  'src/app/pages/pages/my-work/tasks/components/task-metadata/task-metadata.component.ts',
  'src/app/pages/pages/my-work/tasks/components/tasks-executed/tasks-executed.component.ts',
  'src/app/pages/pages/bpm/core/cadastral/syn/main/syn-main.component.ts',
  'src/app/apps/components/tables/table-workflow/components/task-list/task-list.component.ts',
  'src/app/apps/components/information-property/information-property-owners/information-property-owners.component.ts',
  'src/app/apps/components/information-property/information-property-owners/add-property-owner/add-property-owner.component.ts',
  'src/app/apps/components/information-property/information-property-owners/editing-property-owner/editing-property-owner.component.ts',
  'src/app/pages/pages/bpm/core/cadastral/res/validate/res-validate.component.ts',
  'src/app/apps/components/tables/table-certificate-search/filter-certificate-search/filter-certificate-search.component.ts',
  'src/app/shared/services/index.ts',
  'src/app/apps/components/information-property/property-appraisal-information/auto-appraisal/auto-appraisal.component.ts',
  'test/app/apps/services/bpm/bpm-process.service.spec.ts',
  'src/app/pages/pages/my-work/tasks/components/task-card/task-card.component.ts',
  'src/app/pages/pages/my-work/tasks/tasks-panel/tasks-panel.component.ts',
  'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component.ts',
  'src/app/apps/components/bpm/alfa-main/alfa-main-information/view-changes/view-changes.component.ts',
  'test/app/apps/services/bpm/rrright.service.spec.ts',
  'test/app/apps/services/bpm/sync-main.service.spec.ts',
  'test/app/apps/services/bpm/tasks-panel.service.spec.ts',
  'test/app/apps/services/bpm/dynamic-components.service.spec.ts',
  'test/app/apps/services/bpm/information-person.service.spec.ts',
  'test/app/apps/services/bpm/bpm-core.service.spec.ts',
  'test/app/apps/services/bpm/core/alfa-main.service.spec.ts',
  'test/app/apps/services/bpm/core/document/main/attachment.service.spec.ts',
  'test/app/apps/components/bpm/alfa-main/crud-alfa-main/crud-alfa-main.component.spec.ts'
];

// Service mapping from old paths to new service names
const serviceMapping = {
  'apps/services/bpm/bpm-core.service': 'bpm-core.service',
  'apps/services/bpm/workflow.service': 'workflow.service',
  'apps/services/bpm/tasks-panel.service': 'tasks-panel.service',
  'apps/services/bpm/core/alfa-main.service': 'alfa-main.service',
  'apps/services/bpm/core/participants-process.service': 'participants-process.service',
  'apps/services/bpm/core/res.service': 'res.service',
  'apps/services/bpm/core/document/main/attachment.service': 'attachment.service',
  'apps/services/bpm/bpm-process.service': 'bpm-process.service',
  'apps/services/bpm/information-person.service': 'information-person.service',
  'apps/services/bpm/participants-service.service': 'participants-service.service',
  'apps/services/bpm/rrright.service': 'rrright.service',
  'apps/services/bpm/recognition-property.service': 'recognition-property.service',
  'apps/services/bpm/sync-main.service': 'sync-main.service',
  'apps/services/bpm/dynamic-components.service': 'dynamic-components.service'
};

function updateImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  Object.keys(serviceMapping).forEach(oldPath => {
    const serviceName = serviceMapping[oldPath];

    // Pattern 1: Absolute path from src
    const pattern1 = new RegExp(`from ['"]src/${oldPath.replace(/\//g, '/')}['"]`, 'g');
    if (pattern1.test(content)) {
      content = content.replace(pattern1, `from '@features/bpm-workflows/services/${serviceName}'`);
      modified = true;
    }

    // Pattern 2: Relative path with ../
    const pattern2 = new RegExp(`from ['"].*?/${oldPath.replace(/^apps\/services\/bpm\//, '')}['"]`, 'g');
    if (pattern2.test(content)) {
      content = content.replace(pattern2, `from '@features/bpm-workflows/services/${serviceName}'`);
      modified = true;
    }

    // Pattern 3: Just the service path
    const shortPath = oldPath.replace('apps/services/bpm/', '');
    const pattern3 = new RegExp(`from ['"].*${shortPath}['"]`, 'g');
    if (pattern3.test(content)) {
      content = content.replace(pattern3, `from '@features/bpm-workflows/services/${serviceName}'`);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${filePath}`);
    return true;
  }

  return false;
}

let count = 0;
filesToUpdate.forEach(file => {
  if (updateImports(file)) {
    count++;
  }
});

console.log(`\nUpdated imports in ${count} files successfully!`);
