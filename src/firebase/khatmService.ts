import { db } from './firebase';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  Timestamp,
  runTransaction,
  query,
  where,
  getDocs
} from 'firebase/firestore';

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

/* ---------------- SLUG ---------------- */

const generateSlug = (name: string): string => {
  const safeName = name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '');

  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${safeName}-${randomSuffix}`;
};

/* ---------------- CREATE KHATM ---------------- */

export const createKhatm = async (name: string): Promise<string> => {
  try {
    const slug = generateSlug(name);

    const data: Omit<Khatm, 'id'> = {
      name,
      slug,
      currentPage: 1,
      totalPages: 604,
      isCompleted: false,
      completedCount: 0,
      createdAt: Timestamp.now(),
    };

    console.log('🔥 FIRESTORE CREATE PAYLOAD:', data);

    await addDoc(collection(db, KHATM_COLLECTION), data);

    return slug;
  } catch (error) {
    console.error('❌ Error creating khatm:', error);
    throw error;
  }
};

/* ---------------- GET BY ID ---------------- */

export const getKhatmById = async (id: string): Promise<Khatm | null> => {
  const docRef = doc(db, KHATM_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return { id: docSnap.id, ...docSnap.data() } as Khatm;
};

/* ---------------- GET BY SLUG ---------------- */

export const getKhatmBySlug = async (slug: string): Promise<Khatm | null> => {
  const q = query(
    collection(db, KHATM_COLLECTION),
    where('slug', '==', slug)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Khatm;
};

/* ---------------- PAGE ASSIGNMENT ---------------- */

export interface PageAssignment {
  startPage: number;
  endPage: number;
  isCompleted: boolean;
}

export const assignPages = async (
  khatmId: string,
  pagesRequested: number
): Promise<PageAssignment> => {
  const khatmRef = doc(db, KHATM_COLLECTION, khatmId);

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(khatmRef);

    if (!snap.exists()) {
      throw new Error('Khatm does not exist');
    }

    const data = snap.data() as Khatm;

    const startPage = data.currentPage;
    const remainingPages = data.totalPages - startPage + 1;

    const pagesToAssign = Math.min(pagesRequested, remainingPages);
    const endPage = startPage + pagesToAssign - 1;

    const nextRawPage = endPage + 1;
    const isFinishedNow = nextRawPage > data.totalPages;

    // RESTART LOGIC: If finished, reset current page to 1 for the next person
    const finalCurrentPage = isFinishedNow ? 1 : nextRawPage;

    transaction.update(khatmRef, {
      currentPage: finalCurrentPage,
      isCompleted: false, // Always false now to allow continuous joining
      completedCount: isFinishedNow
        ? (data.completedCount || 0) + 1
        : data.completedCount || 0,
    });

    return {
      startPage,
      endPage,
      isCompleted: isFinishedNow,
    };
  });
};
