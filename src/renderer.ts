import './index.css';

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'styles.css';
document.head.appendChild(style);

const script = document.createElement('script');
script.type = 'module';
script.src = 'main.js';
document.body.appendChild(script);
