# Daily Task & Aims Tracker

## 🌐 Live Application

**[Open Arham's Daily Task & Aims Tracker](https://arhams-routine-tracker.netlify.app/)**

Try the deployed Progressive Web App and explore its Routine Tracker and Daily, Weekly, and Monthly Aims features.

#### Video Demo

[Watch the complete 4:38 application walkthrough](https://youtu.be/vs8LfbhtwP8)

Selected sections:
- [Application overview and interface — 00:39](https://youtu.be/vs8LfbhtwP8?t=39)
- [Routine Tracker demonstration — 01:06](https://youtu.be/vs8LfbhtwP8?t=66)
- [Aims Tracker demonstration — 03:07](https://youtu.be/vs8LfbhtwP8?t=187)

#### Description:
The **Daily Task & Aims Tracker** is a Progressive Web App (PWA) designed to help users stay consistent with their daily routines, weekly goals, and long-term aims — all in one place.

This project began as a simple solution to a real-life problem. I used to write my daily routines on a whiteboard, but my little brother often erased them when I wasn’t around. As a result, I’d forget my plans and lose track of my progress. So, I decided to build an app where my routines and aims would stay safe and accessible — on my mobile, laptop, offline, or online — anytime and anywhere.

---

### 🗓 Features

The app has **two main pages**:

#### 1. Routine Tracker Page
- Create **time-based daily routines** such as “Fajr,” “Study,” or “Workout.”
- Each section includes multiple tasks that can be dynamically **added, checked, or deleted**.
- Features **light and dark mode** with smooth transitions.
- Stores user preferences locally, so theme and tasks persist after reloads.
- Checks scheduled task times every 30 seconds and can show browser notifications when permission is granted and the app is open.
- Supports offline use after the Service Worker has successfully cached the application files.

#### 2. Aims Page
- Divided into **Daily, Weekly, and Monthly** aims.
- Users can dynamically add and track their goals in each section.
- Each goal includes **checkboxes and nested sub-goals** for better organization.
- Visually designed like a digital “planner,” focusing on key growth areas like **Body, Study, and Faith**.

---

### 📶 Offline Support
The app is built as a **Progressive Web App (PWA)** — meaning once it’s opened, it can be accessed without an internet connection.  
The Service Worker (sw.js) caches the essential application files, allowing previously cached pages and assets to load without an internet connection.  
Users can also **install the app** on their devices directly from the browser, just like a native mobile app.

---

### 📁 File Overview
- **index.html** – The main Routine Tracker page.
- **aims.html** – The Aims management page.
- **css/style.css** – Styles for the Routine Tracker page.
- **css/aims.css** – Styles for the Aims page.
- **app.js** – Handles logic for adding, deleting, and toggling tasks.
- **aims.js** – Manages goal and sub-goal functionality on the Aims page.
- **sw.js** – Service Worker that enables offline access.
- **manifest.json** – Defines PWA installation settings and icons.
- **/icons** – Contains app icons used for installation and display.

---

### 🎨 Design Choices
- Two separate CSS files were used to keep the **layout modular and organized**, as each page has a unique design and functionality.
- The **theme toggle** uses Local Storage so the app remembers the user’s preference even after closing.
- The **UI design** focuses on simplicity and accessibility — ensuring quick daily usability.
- **Netlify** was chosen for hosting due to its speed, reliability, and PWA-friendly environment.

---

### ⚙️ Implementation Notes
- Task reminders use a timer in the open page; they are not background or push notifications when the app is closed.
- User data is stored locally in the browser and is not synchronized across devices.

### 💡 Future Improvements
- Add a **draggable feature** to reorder tasks more intuitively.
- Introduce **undo/redo** buttons for accidental deletions.
- Include a **date progress bar** (e.g., “Week 2 of Month”).
- Implement **cloud synchronization** (e.g., Firebase) for cross-device data backup.

---

### 🧠 What I Learned
Building this project taught me:
- DOM manipulation and how to dynamically render HTML content.
- How to store, retrieve, and update data using **Local Storage**.
- How to register and manage **Service Workers** for offline-first design.
- The fundamentals of creating and deploying a **Progressive Web App**.
- Practical problem-solving — turning a personal inconvenience into a functional tool.

This project reflects my personal philosophy of **discipline, balance, and consistency** — combining daily routine tracking with long-term goal setting. It also strengthened my confidence as a beginner developer applying concepts from CS50 to a real, meaningful solution.

---

### 🧭 Summary
The **Daily Task & Aims Tracker** isn’t just a to-do list — it’s a digital reflection of my lifestyle and growth journey.  
It keeps me organized, productive, and accountable, whether I’m studying, exercising, or working on personal development.

---

*Developed as my Final Project for CS50x 2025.*
