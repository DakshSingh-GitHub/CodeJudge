# ⚖️ Welcome to Code Judge! 🚀

Hey there, fellow coder! 👋 Welcome to **Code Judge**, your very own pocket-sized Online Judge! Think of it like a mini Codeforces, but super easy to play with and learn from. 🎈

Built with love using **Flask** 🌶 and **Next.js** ⚛️, this little judge lets you submit Python code, runs it against secret test cases, and gives you that sweet, sweet verdict! 🟢

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

- **Backend**: Python 🐍 + Flask 🌶
- **Frontend**: Next.js ⚛️ + TypeScript 📘 + Tailwind CSS 🎨
- **Editor**: Monaco Editor (The same one in VS Code! 💻)

---

## 🚀 Getting Started

Ready to dive in? Here’s how to get the party started on your local machine! 🎈

### 🌶 1. Fire up the Backend
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
- 🟡 **Phase 2**: Handling multiple test cases (Working on it! 🛠)
- 🔵 **Phase 3**: Better problem definitions (Planned! 📐)
- 🔐 **Phase 4**: Super secure sandboxing with Docker (Soon! 🐳)
- 🌐 **Phase 5**: Submissions history & User accounts (The dream! ✨)

---

### 🙌 Join the Fun!
Got questions? Suggestions? Just want to say hi? We're happy to have you here! Happy coding! 🌈✨

---
*Made with ❤️ for the coding community.*
