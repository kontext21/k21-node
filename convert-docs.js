const fs = require('fs');
const path = require('path');

function convertToMintlifyMDX(content, title) {
  // Add Mintlify frontmatter
  const frontmatter = `---
title: '${title}'
description: 'API documentation for ${title}'
---

`;
  
  // Convert TypeDoc links to Mintlify format
  let converted = content
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      // Keep external links as is
      if (url.startsWith('http')) return match;
      // Convert internal links to Mintlify format
      return `[${text}](${url.replace(/\.md$/, '')})`;
    })
    .replace(/`([^`]+)`/g, '`$1`'); // Ensure code blocks are properly formatted

  return frontmatter + converted;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const title = path.basename(file, '.md');
      const mdxContent = convertToMintlifyMDX(content, title);
      
      // Create output directory if it doesn't exist
      const outputDir = path.join(__dirname, 'docs', 'mdx');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write converted MDX file
      const outputPath = path.join(outputDir, `${title}.mdx`);
      fs.writeFileSync(outputPath, mdxContent);
    }
  });
}

// Process the TypeDoc output directory
const docDir = path.join(__dirname, 'docs');
if (fs.existsSync(docDir)) {
  processDirectory(docDir);
  console.log('Conversion complete! Check docs/mdx directory for Mintlify-compatible MDX files.');
} else {
  console.error('TypeDoc output directory not found. Please run TypeDoc first.');
} 