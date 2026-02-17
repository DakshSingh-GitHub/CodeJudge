# ⚖️ Welcome to Code Judge! 🚀

Hey there, fellow coder! 👋 Welcome to **Code Judge**, your very own pocket-sized Online Judge! Think of it like a mini Codeforces, but super easy to play with and learn from. 🎈

Built with love using **Flask** 🌶 and **Next.js** ⚛️, this little judge lets you submit Python code, runs it against secret test cases, and gives you that sweet, sweet verdict! 🟢

---

## License Notice

CodeJudge uses a dual-license structure to balance openness and intellectual property protection.

### Frontend (MIT License)
The frontend located in the `/frontend` directory is licensed under the MIT License.

This means you are free to:

- Use the frontend code
- Modify the frontend code
- Distribute the frontend code
- Use it in your own projects

As long as the original copyright and license notice are included.

See: `/frontend/LICENSE`

---

### Backend and Core System (Proprietary License)

The backend, judge core, database structure, API, and all other components outside the `/frontend` directory are licensed under the **CodeJudge Proprietary License v1.0**.

This means you may NOT:

- Copy the backend or core system
- Modify the backend without permission
- Redistribute CodeJudge
- Sell CodeJudge or derivatives
- Create competing platforms based on CodeJudge

Explicit written permission is required for:

- Commercial use
- Redistribution
- Modification of protected components

See: `/LICENSE`

---

### Summary

| Component | License | Status |
|---------|--------|--------|
| Frontend | MIT License | Open |
| Backend | Proprietary | Restricted |
| Judge Core | Proprietary | Restricted |
| Database Structure | Proprietary | Restricted |

---

Unauthorized use, redistribution, or commercialization of proprietary components is strictly prohibited.

For licensing inquiries, contact: daksh.singh.2407@gmail.com

## 📸 Screenshots

| General UI | Code Editor & Problem | Submission Result |
| :---: | :---: | :---: |
| ![General UI](screenshots/general_ui.png) | ![Code Problem](screenshots/code_problem.png) | ![Saved Result](screenshots/saved_result.png) |

---

## ✨ Super Cool Features

- 🐍 **Python Power**: Submit your Python solutions and see them fly!
- 📥 **Custom Stdin**: Test your code with any input you like.
- 🎯 **Smart Evaluation**: We compare your output against the truth with precision.
- 🚦 **Verdict System**:
  - 🟢 **AC (Accepted)** — You nailed it! Boom! 💥
  - 🔴 **WA (Wrong Answer)** — Almost there! Keep trying! 💪
  - ⚠️ **RE (Runtime Error)** — Oops! Something went "pop"! 🎈
  - ⏱ **TLE (Time Limit Exceeded)** — Your code took a scenic route! 🏎
- ⚡️ **Light & Dark Mode**: Code in style, day or night! 🌓
- 📏 **Draggable UI**: Resize the viewer and editor exactly how you like it.

## ⭐ Super Cool features Pocket edition
 - 💿 **Response Storage**: Uses Localstorage of a browser to store (takes less than 10MB for submissions, for roughly 6200 submissions)

---

## 🧠 The Magic Behind the Curtain

Ever wondered how a judge works? It's like a tiny robot 🤖 doing this:
1. **Grabs** your code from the API.
2. **Writes** it into a safe little temporary file.
3. **Runs** it in a special subprocess with your input.
4. **Catches** the output (and any errors!).
5. **Compares** it to the correct answer.
6. **Delivers** your shiny verdict! 🏆

---

## 🛠 Our Toasty Tech Stack

- **Backend**: Python 🐍 + FastAPI 🌶
- **Frontend**: Next.js ⚛️ + TypeScript 📘 + Tailwind CSS 🎨
- **Editor**: Monaco Editor (The same one in VS Code! 💻)

---

## 🚀 Getting Started

Ready to dive in? Here’s how to get the party started on your local machine! 🎈

## ⚠️ WARNING NOTE ⚠️
* If you want to test the code submissions aggressively, multiple submissions and high number of IDE execution, then I'll suggest you to fire up the backend on your machine. Current deployment can't handle that large number of submissions.

### 🌶 1. Fire up the Backend (for aggressive testing)
```bash
cd judge-backend
python app.py
```
*Your judge is now waiting for submissions at `http://127.0.0.1:5000`!*

### ⚛️ 2. Boot up the Frontend
```bash
cd judge-frontend
npm install  # (First time only!)
npm run dev
```
*Open `http://localhost:3000` and start coding!* 🎊

---

## 🧭 The Road Ahead (Our Roadmap)

We're constantly growing! Here's what's cooking:
- 🟢 **Phase 0 & 1**: Core foundations & Verdicts (Done! 🎉)
- 🟡 **Phase 2**: Handling multiple test cases (Done 🛠)
- 🔵 **Phase 3**: Better problem definitions (Planned! 📐)
- 🔐 **Phase 4**: Super secure sandboxing with Docker (Done! 🐳)
- 🌐 **Phase 5**: Submissions history & User accounts (Almost done!)

---

### 🙌 Join the Fun!
Got questions? Suggestions? Just want to say hi? We're happy to have you here! Happy coding! 🌈✨

---
*Made with ❤️ for the coding community.*
