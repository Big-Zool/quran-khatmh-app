import { db } from './firebase';
import { collection, addDoc, getDoc, doc, Timestamp, runTransaction, query, where, getDocs } from 'firebase/firestore';

export interface Khatm {
    id?: string;
    name: string;
    slug: string;
    currentPage: number;
    totalPages: number;
    isCompleted: boolean;
    completedCount: number;
    createdAt: Timestamp;
}

const KHATM_COLLECTION = 'khatms';

const generateSlug = (name: string): string => {
    const safeName = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${safeName}-${randomSuffix}`;
};

export const createKhatm = async (name: string): Promise<string> => {
    try {
        const slug = generateSlug(name);
        // Ensure slug is unique? For now, randomSuffix makes it highly probable.
        // In a real app, we'd check existence.

        await addDoc(collection(db, KHATM_COLLECTION), {
            name,
            slug,
            currentPage: 1,
            totalPages: 604,
            isCompleted: false,
            completedCount: 0,
            createdAt: Timestamp.now(),
        });
        return slug; // Return SLUG, not ID, to the UI controller
    } catch (error) {
        console.error("Error creating khatm: ", error);
        throw error;
    }
};

export const getKhatmById = async (id: string): Promise<Khatm | null> => {
    try {
        const docRef = doc(db, KHATM_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Khatm;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting khatm: ", error);
        throw error;
    }
};

export const getKhatmBySlug = async (slug: string): Promise<Khatm | null> => {
    try {
        const q = query(collection(db, KHATM_COLLECTION), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as Khatm;
        }
        return null;
    } catch (error) {
        console.error("Error getting khatm by slug:", error);
        throw error;
    }
}

export interface PageAssignment {
    startPage: number;
    endPage: number;
    isCompleted: boolean;
}

export const assignPages = async (khatmId: string, pagesRequested: number): Promise<PageAssignment> => {
    try {
        const khatmRef = doc(db, KHATM_COLLECTION, khatmId);

        return await runTransaction(db, async (transaction) => {
            const khatmDoc = await transaction.get(khatmRef);
            if (!khatmDoc.exists()) {
                throw new Error("Khatm document does not exist!");
            }

            const data = khatmDoc.data() as Khatm;

            if (data.isCompleted || data.currentPage > data.totalPages) {
                throw new Error("This Khatm is already completed!");
            }

            const startPage = data.currentPage;
            // Calculate how many pages we can actually assign
            // If current is 600 and max is 604, and user asks for 5:
            // Available = 604 - 600 + 1 = 5.
            // Wait, range logic:
            // Pages: 600, 601, 602, 603, 604 = 5 pages.
            // So if start=600, end = 600 + 5 - 1 = 604.  OK.

            let pagesToAssign = pagesRequested;
            const remainingPages = data.totalPages - startPage + 1;

            if (pagesToAssign > remainingPages) {
                pagesToAssign = remainingPages;
            }

            const endPage = startPage + pagesToAssign - 1;
            const newCurrentPage = endPage + 1;
            const isFinishedNow = newCurrentPage > data.totalPages;

            transaction.update(khatmRef, {
                currentPage: newCurrentPage,
                isCompleted: isFinishedNow,
                completedCount: isFinishedNow ? (data.completedCount || 0) + 1 : (data.completedCount || 0)
            });

            return {
                startPage,
                endPage,
                isCompleted: isFinishedNow
            };
        });
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw error;
    }
};
