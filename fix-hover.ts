import fs from 'fs';

const filepath = 'src/AdminDashboard.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// 1. Replace all <div className="... hu-card ..."> with <motion.div whileHover={{ y: -6, borderColor: 'var(--card-stroke-hover)', shadow: 'var(--card-shadow-hover)' }} ...>
// We need to be careful with regex.

// Let's use a replacer function for any tag starting with <div or <motion.div that has className containing hu-card or hu-card-alt.
const regex = /<(div|motion\.div)([^>]*?className=(['"])[^'"]*?hu-card(?:-alt)?[^'"]*\3[^>]*?)>/g;

content = content.replace(regex, (match, tag, rest) => {
  // If it already has whileHover, don't touch it.
  if (match.includes('whileHover=')) {
    return match;
  }
  
  const whileHoverAttr = ` whileHover={{ y: -6, borderColor: 'var(--card-stroke-hover)', boxShadow: 'var(--card-shadow-hover)' }}`;
  
  if (tag === 'div') {
    return `<motion.div${whileHoverAttr}${rest}>`;
  } else {
    return `<motion.div${whileHoverAttr}${rest}>`;
  }
});

// We also need to change matching closing tags for those we converted from div to motion.div.
// This is notoriously hard with regex because of nesting.
// Instead of converting `div` to `motion.div`, an easier React-specific approach:

// What if we just add a custom class `hover-lift` and handle it in CSS?
// No, the prompt requires "In AdminDashboard.tsx... apply a hover effect".

// Since we know the codebase, let's just use `whileHover` on `motion.div`.
// And for `div`, we can either convert them manually or via script.
// Let's just output the matches to see what we're dealing with.
