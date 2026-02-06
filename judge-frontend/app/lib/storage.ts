export interface Submission {
    id: string;
    problemId: string;
    problemTitle: string;
    code: string;
    final_status: string;
    summary: {
        passed: number;
        total: number;
    };
    total_duration: number;
    timestamp: number;
}

const DB_NAME = "CodeJudgeDB";
const DB_VERSION = 1;
const STORE_NAME = "submissions";
const OLD_STORAGE_KEY = "code_judge_submissions";

async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("problemId", "problemId", { unique: false });
                store.createIndex("timestamp", "timestamp", { unique: false });
            }
        };
    });
}

export async function saveSubmission(submission: {
    problemId: string;
    problemTitle: string;
    code: string;
    final_status: string;
    summary: { passed: number; total: number };
    total_duration: number | undefined
}): Promise<Submission | null> {
    if (typeof window === "undefined") return null;

    // Check for migration from localStorage
    await migrateFromLocalStorage();

    const db = await openDB();

    // Check for duplicates first (this might be slightly slower in IDB but necessary)
    const existing = await getSubmissionsByProblemId(submission.problemId);
    const isDuplicate = existing.some(s => s.code === submission.code);

    if (isDuplicate) return null;

    const newSubmission: Submission = {
        ...submission,
        total_duration: submission.total_duration ?? 0,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(newSubmission);

        request.onsuccess = async () => {
            // Trim to 50 latest if needed
            await trimSubmissions();
            resolve(newSubmission);
        };
        request.onerror = () => reject(request.error);
    });
}

async function trimSubmissions() {
    const db = await openDB();
    const submissions = await getSubmissions();
    if (submissions.length > 50) {
        const toDelete = submissions.slice(50);
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        toDelete.forEach(sub => store.delete(sub.id));
    }
}

export async function getSubmissions(): Promise<Submission[]> {
    if (typeof window === "undefined") return [];

    // Check for migration from localStorage
    await migrateFromLocalStorage();

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("timestamp");
        const request = index.openCursor(null, "prev"); // Newest first
        const results: Submission[] = [];

        request.onsuccess = () => {
            const cursor = request.result;
            if (cursor && results.length < 50) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

export async function getSubmissionsByProblemId(problemId: string): Promise<Submission[]> {
    if (typeof window === "undefined") return [];

    // Check for migration from localStorage
    await migrateFromLocalStorage();

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("problemId");
        const request = index.getAll(IDBKeyRange.only(problemId));

        request.onsuccess = () => {
            const results = (request.result as Submission[]).sort((a, b) => b.timestamp - a.timestamp);
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function deleteSubmission(id: string): Promise<void> {
    if (typeof window === "undefined") return;

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

let migrationPromise: Promise<void> | null = null;

async function migrateFromLocalStorage() {
    if (typeof window === "undefined") return;
    if (migrationPromise) return migrationPromise;

    migrationPromise = (async () => {
        const stored = localStorage.getItem(OLD_STORAGE_KEY);
        if (!stored) return;

        try {
            const submissions: Submission[] = JSON.parse(stored);
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            for (const sub of submissions) {
                store.put(sub); // Use put to avoid errors if id already exists
            }

            await new Promise((resolve) => {
                transaction.oncomplete = resolve;
            });

            localStorage.removeItem(OLD_STORAGE_KEY);
            console.log("Successfully migrated submissions to IndexedDB");
        } catch (e) {
            console.error("Migration failed", e);
        }
    })();

    return migrationPromise;
}
