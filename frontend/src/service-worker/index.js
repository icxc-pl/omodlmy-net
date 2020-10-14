import SW from './SW';

// Add install listener
self.addEventListener('install', SW.handleInstall.bind(SW));

// Add activate listener
self.addEventListener('activate', SW.handleActivate.bind(SW));

// Add fetch listener
self.addEventListener('fetch', SW.handleFetch.bind(SW));
