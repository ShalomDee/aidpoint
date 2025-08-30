# AidPoint – Local Emergency Resource Finder

<p align="center">
  <img src="public/logo.png" alt="AidPoint Logo" width="100"/>
</p>

**AidPoint** is a Progressive Web App (PWA) that helps users quickly find **local emergency resources** — such as hospitals, police stations, fire stations, and helplines — with a clean, offline-capable interface.

Built with React and service workers, AidPoint ensures reliability **even with poor or no internet connection**, making it a practical companion during emergencies.

#### 🎥 Video Demo: [AidPoint Demo on YouTube](https://youtu.be/Xt07w23A_9g)

---

## 🌟 Key Features

* 🗺️ **Find Local Resources** — tap into Google Maps data to locate hospitals, shelters, police, and other emergency services
* 📞 **Quick Call Actions** — one-tap access to 911, hotlines, or saved emergency contacts
* ⚡ **Offline-First Support** — caches the UI and essential assets for use without a network
* 📱 **Installable PWA** — works like a native app on iOS/Android and desktop
* 🖥️ **Modern React UI** — fast, responsive, and mobile-friendly

---

## 🛠️ Tech Stack

* [React](https://reactjs.org/) – UI framework
* [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) – offline + caching strategies
* [Google Maps API](https://developers.google.com/maps) – location data & mapping
* [Tailwind CSS](https://tailwindcss.com/) – design system
* [Netlify](https://netlify.com) – deployment & hosting

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/ShalomDee/resource-finder.git
cd resource-finder
npm install
```

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
  ├── manifest.json     # PWA manifest
  └── sw.js             # Custom service worker
src/
  ├── components/       # Reusable UI components
  ├── screens/          # App screens (Home, Contacts, Map, etc.)
  ├── App.js            # Main React app component
  └── ...
```

---

## 🔮 Roadmap

* 🔄 Dynamic API caching for live map/search results
* 🧭 Location-based recommendations (nearest help centers)
* 📲 SMS-based fallback for low-connectivity areas
* 🌍 Multi-language support
* 🔐 Optional authentication for personalized resources

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
