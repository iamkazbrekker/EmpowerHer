import path from 'node:path'

export const redirectTo = (req, __dirname) => {
    let pathToResources;
    
        if (req.url === '/favicon.ico') {
          pathToResources = path.join(__dirname, 'public', 'assets', 'favicon.ico');
        } else if (req.url === '/' || req.url === '/login'){
          pathToResources = path.join(__dirname, 'public', 'login', 'index.html')
        } else if (req.url === '/home'){
          pathToResources = path.join(__dirname, 'public', 'home', 'home.html')
        } else if (req.url == '/profile'){
          pathToResources = path.join(__dirname, 'public', 'profile', 'profile.html')
        } else{
          pathToResources = path.join(__dirname, 'public', req.url)
        }
    return pathToResources
}