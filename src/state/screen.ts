import { create } from 'zustand';

type ScreenState = {
    height: number;
    width: number;
    setScreenDimensions: (height: number, width: number) => void;
}

const useScreenStore = create<ScreenState>()(
    (set) => ({
        height: 0,
        width: 0,
        setScreenDimensions: (height, width) => {set((state) => ({ height, width }))}
    })
)

export { useScreenStore };
export type { ScreenState };
