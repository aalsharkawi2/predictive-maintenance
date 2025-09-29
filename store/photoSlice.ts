import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceType } from '@/types/maintenance';

export type CapturedPhoto = {
    uri: string;
    width: number;
    height: number;
    createdAt: number;
};

interface PhotoState {
    last?: CapturedPhoto;
    shouldCloseCameraOnce?: boolean;
    byDeviceType?: Partial<Record<DeviceType, CapturedPhoto | undefined>>;
}

const initialState: PhotoState = { byDeviceType: {} };

const photoSlice = createSlice({
    name: 'photo',
    initialState,
    reducers: {
        setLastPhoto(state, action: PayloadAction<CapturedPhoto | undefined>) {
            state.last = action.payload;
        },
        setDevicePhoto(
            state,
            action: PayloadAction<{ deviceType: DeviceType; photo?: CapturedPhoto }>,
        ) {
            const { deviceType, photo } = action.payload;
            state.byDeviceType = state.byDeviceType || {};
            state.byDeviceType[deviceType] = photo;
        },
        clearDevicePhoto(state, action: PayloadAction<DeviceType>) {
            state.byDeviceType = state.byDeviceType || {};
            state.byDeviceType[action.payload] = undefined;
        },
        clearAllDevicePhotos(state) {
            state.byDeviceType = {};
        },
        setShouldCloseCameraOnce(state, action: PayloadAction<boolean | undefined>) {
            state.shouldCloseCameraOnce = action.payload ?? false;
        },
        clearLastPhoto(state) {
            state.last = undefined;
            state.shouldCloseCameraOnce = false;
            state.byDeviceType = {};
        },
    },
});

export const {
    setLastPhoto,
    clearLastPhoto,
    setShouldCloseCameraOnce,
    setDevicePhoto,
    clearDevicePhoto,
    clearAllDevicePhotos,
} = photoSlice.actions;
export default photoSlice.reducer;
