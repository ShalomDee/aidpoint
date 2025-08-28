# AidPoint - Local Emergency Resource Finder

![AidPoint Logo](public/logo192.png)

A React web app with offline-first support using a custom service worker for caching.  
Built to explore caching strategies, service workers, and progressive web app (PWA) concepts.

---

## 🚀 Features
- ⚡ **Offline support** — service worker caches resources for reliability without network
- 🖥️ **React-based UI** — fast, modular front-end
- 📦 **Static asset caching** — CSS, JS, and manifest stored locally
- 🔄 **Cache versioning** — old caches cleaned up automatically during updates

---

## 🛠️ Tech Stack
- [React](https://reactjs.org/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [ESLint](https://eslint.org/) for linting
- [npm](https://www.npmjs.com/) for package management

---

## 🏗️ Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/ShalomDee/resource-finder.git
cd resource-finder
npm install
````

Run the development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

---

## 📂 Project Structure

```
public/
  ├── index.html
  ├── manifest.json
  └── sw.js          # Custom service worker
src/
  ├── App.js         # Main React app component
  └── ...
```

---

## ✨ Future Improvements

* Add dynamic API caching (network-first strategy for live data)
* Installable PWA support
* CI/CD integration

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
