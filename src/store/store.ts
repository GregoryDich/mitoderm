import { create } from 'zustand';
import { ModalType } from '@/types';

interface RootState {
  modalIsOpen: boolean;
  toggleModal: (value: boolean) => void;
  galleryPage: number;
  setGalleryPage: (page: number) => void;
  introPage: number;
  setIntroPage: (page: number) => void;
  reviewPage: number;
  setReviewPage: (page: number) => void;
  modalContent: ModalType;
  setModalContent: (arg: ModalType) => void;
  numberOfTickets: number;
  setNumberOfTickets: (arg: number) => void;
  isDiscounted: boolean;
  setIsDiscounted: (arg: boolean) => void;
}

const useAppStore = create<RootState>((set) => ({
  modalIsOpen: false,
  toggleModal: () =>
    set((state) => ({ modalIsOpen: (state.modalIsOpen = !state.modalIsOpen) })),
  galleryPage: 0,
  setGalleryPage: (page: number) =>
    set((state) => ({ galleryPage: (state.galleryPage = page) })),
  introPage: 0,
  setIntroPage: (page: number) =>
    set((state) => ({ introPage: (state.introPage = page) })),
  reviewPage: 0,
  setReviewPage: (page: number) =>
    set((state) => ({ reviewPage: (state.reviewPage = page) })),
  modalContent: 'privatePolicy',
  setModalContent: (arg: ModalType) =>
    set((state) => ({ modalContent: (state.modalContent = arg) })),
  numberOfTickets: 1,
  setNumberOfTickets: (arg: number) =>
    set((state) => ({ numberOfTickets: (state.numberOfTickets = arg) })),
  isDiscounted: false,
  setIsDiscounted: (arg: boolean) =>
    set((state) => ({ isDiscounted: (state.isDiscounted = arg) })),
}));

export default useAppStore;
