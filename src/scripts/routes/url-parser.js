// src/scripts/routes/url-parser.js

function extractPathnameSegments(path) {
  const splitUrl = path.split('/').filter(s => s !== ''); // Filter string kosong
  
  return {
    resource: splitUrl[0] || null, // Segmen pertama setelah hash (misal 'stories')
    id: splitUrl[1] || null,       // Segmen kedua (misal '123' untuk ID)
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  // Jika ada ID, dan resource-nya adalah 'stories', maka tambahkan ':id'
  // Anda bisa menambahkan kondisi lain di sini jika ada resource lain yang menggunakan ID
  if (pathSegments.id) {
    // Memastikan rute 'stories' yang memiliki ':id'
    if (pathSegments.resource === 'stories') {
        pathname = pathname.concat('/:id');
    } else {
        // Untuk resource lain yang mungkin punya ID tapi tidak cocok pola ':id' umum
        // Ini mungkin perlu disesuaikan tergantung bagaimana Anda ingin menangani rute lain
        pathname = pathname.concat(`/${pathSegments.id}`);
    }
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}