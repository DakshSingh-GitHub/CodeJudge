# code-judge

# ⚖️ Mini Online Judge (Flask Backend)

> A lightweight **Online Code Judge** built using **Flask** that executes user-submitted Python code, evaluates it against test cases, and returns verdicts — just like Codeforces, but pocket-sized 😎

---

## ✨ Features

✅ Execute **Python code submissions**  
✅ Accept **custom input (stdin)**  
✅ Compare output with **expected output**  
✅ Verdict system:
- 🟢 **AC** — Accepted  
- 🔴 **WA** — Wrong Answer  
- ⚠️ **RE** — Runtime Error  
- ⏱ **TLE** — Time Limit Exceeded  

✅ Execution time limits  
✅ Clean **REST API**  
✅ JSON-based request/response  
✅ Beginner-friendly but **system-level logic**

---

## 🧠 How It Works (High Level)

1. User sends Python code via API
2. Code is written to a **temporary file**
3. Code is executed using `subprocess`
4. Input is piped through `stdin`
5. Output is captured from `stdout`
6. Output is compared with expected output
7. Judge returns a **verdict**

> ⚠️ Code execution is sandboxed only at a basic level (timeouts).  
> Advanced isolation (Docker, seccomp) is planned.

---

## 🛠 Tech Stack

- 🐍 **Python**
- 🌶 **Flask**
- ⚙️ `subprocess`
- 📄 `tempfile`
- 🧪 Postman (for API testing)

---

## 🧭 Project Roadmap

This roadmap tracks the evolution of the **Mini Online Judge**, from a simple execution engine to a secure, scalable judging system.

---

### 🟢 Phase 0 — Core Foundations (Completed)

✅ Initialize Flask backend  
✅ Create REST API endpoint (`POST /submit`)  
✅ Accept user-submitted Python code  
✅ Execute code using `subprocess`  
✅ Capture `stdout` and `stderr`  
✅ Handle runtime errors (RE)  
✅ Enforce execution timeout (TLE)  
✅ Return structured JSON responses  

---

### 🟡 Phase 1 — Input, Output & Verdict System (Completed)

✅ Accept custom input via `stdin`  
✅ Capture program output  
✅ Compare actual output with expected output  
✅ AC (Accepted) verdict  
✅ WA (Wrong Answer) verdict  
✅ RE (Runtime Error) verdict  
✅ TLE (Time Limit Exceeded) verdict  
✅ Trim and normalize outputs before comparison  

---

### 🟠 Phase 2 — Test Case Handling (Planned)

✅ Support multiple test cases per submission  
✅ Stop execution on first failed test case  
⬜ Return detailed per-test-case results  
✅ Handle edge cases (extra spaces, newlines)  

---

### 🔵 Phase 3 — Problem Definitions (Planned)

⬜ Store problems as JSON files  
⬜ Include problem metadata (name, description, constraints)  
⬜ Support sample test cases  
⬜ Add hidden test cases  
⬜ Implement custom checker logic  

---

### 🔐 Phase 4 — Security & Isolation (Planned)

⬜ Restrict dangerous Python built-ins  
⬜ Enforce memory limits  
⬜ Sandbox execution using Docker  
⬜ Prevent file system access  
⬜ Harden against infinite loops  

---

### 🌐 Phase 5 — Platform Features (Stretch Goals)

⬜ User authentication  
⬜ Submission history  
⬜ Language support (Java)  
⬜ Leaderboard  
⬜ Deployment  

---

### 📊 Progress Summary

✅ **16 tasks completed**  
🚧 **Project actively under development**
