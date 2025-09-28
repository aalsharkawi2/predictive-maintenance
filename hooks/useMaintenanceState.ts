import { useState, useCallback } from 'react';
import {
    MaintenanceType,
    ColumnType,
    DeviceType,
    DeviceActions,
    ActionItem,
    MaintenanceState,
    Photo,
} from '@/types/maintenance';

export const maintenanceTypes: MaintenanceType[] = ['نهاية', 'جهاز'];
export const columnTypes: ColumnType[] = ['رعد', 'ع', 'ص'];
export const deviceTypes: DeviceType[] = ['سكينة', 'محول', 'لوحة'];

const rawDeviceActions: { [K in DeviceType]: DeviceActions<K>[] } = {
    سكينة: ['مسح العوازل', 'تشحيم السكينة', 'تعديل اللوبات', 'تغيير التشعيرات'],
    محول: [
        'تنظيف الجسم والعوازل وجهاز السليكاجيل',
        'التربيط على العوازل والجسم والكوس والمناولات',
        'عزل الفازات بشريط لحام',
    ],
    لوحة: [
        'تنظيف اللوحة',
        'التربيط على الكوس والبارات',
        'عزل الفازات بشريط لحام',
        'تزويد فوم',
        'إزالة عش',
        'تغيير قواطع',
        'تغيير ورد ومسامير',
    ],
};

const emptyDeviceNotes: { [K in DeviceType]: string[] } = {
    سكينة: [],
    محول: [],
    لوحة: [],
};

function getDeviceActions<T extends DeviceType>(deviceType: T): ActionItem<T>[] {
    const actions = rawDeviceActions[deviceType];
    return actions.map((action) => ({ action, isSelected: false }));
}

export function useMaintenanceState() {
    const [state, setState] = useState<MaintenanceState>(() => ({
        selectedColumnType: 'ص',
        columnNum: '',
        area: '',
        deviceNum: '',
        deviceId: '',
        selectedMaintenanceType: 'جهاز',
        selectedDeviceType: 'لوحة',
        deviceActions: {
            سكينة: getDeviceActions('سكينة'),
            محول: getDeviceActions('محول'),
            لوحة: getDeviceActions('لوحة'),
        },
        deviceNotes: emptyDeviceNotes,
        photo: null,
    }));

    const setColumnType = useCallback((type: ColumnType) => {
        setState((prev) =>
            prev.selectedColumnType === type
                ? prev
                : {
                    ...prev,
                    selectedColumnType: type,
                    deviceId: '',
                    columnNum: '',
                    area: '',
                    deviceNum: '',
                    selectedDeviceType: 'لوحة',
                    deviceActions: {
                        سكينة: getDeviceActions('سكينة'),
                        محول: getDeviceActions('محول'),
                        لوحة: getDeviceActions('لوحة'),
                    },
                    deviceNotes: { ...emptyDeviceNotes },
                    photo: null,
                },
        );
    }, []);

    const setColumnNum = useCallback((num: number | '') => {
        setState((prev) => ({ ...prev, columnNum: num }));
    }, []);

    const setArea = useCallback((num: number | string) => {
        setState((prev) => ({ ...prev, area: num }));
    }, []);

    const setDeviceNum = useCallback((num: number | '') => {
        setState((prev) => ({ ...prev, deviceNum: num }));
    }, []);

    const setDeviceId = useCallback((id: string) => {
        setState((prev) => (prev.deviceId === id ? prev : { ...prev, deviceId: id }));
    }, []);

    const setMaintenanceType = useCallback((type: MaintenanceType) => {
        setState((prev) => {
            if (prev.selectedMaintenanceType === type) return prev;
            return {
                ...prev,
                selectedMaintenanceType: type,
                deviceId: '',
                selectedColumnType: type === 'جهاز' ? 'ص' : null,
                columnNum: '',
                area: '',
                deviceNum: '',
                selectedDeviceType: 'لوحة',
                deviceActions: {
                    سكينة: getDeviceActions('سكينة'),
                    محول: getDeviceActions('محول'),
                    لوحة: getDeviceActions('لوحة'),
                },
                deviceNotes: { ...emptyDeviceNotes },
                photo: null,
            } as MaintenanceState;
        });
    }, []);

    const setDeviceType = useCallback((type: DeviceType) => {
        setState((prev) => (prev.selectedDeviceType === type ? prev : { ...prev, selectedDeviceType: type }));
    }, []);

    const toggleAction = useCallback(<T extends DeviceType>(deviceType: T, actionIndex: number) => {
        setState((prev) => {
            const currentActions = prev.deviceActions[deviceType];
            if (actionIndex < 0 || actionIndex >= currentActions.length) return prev;
            const updatedActions = currentActions.map((item, i) =>
                i === actionIndex ? { ...item, isSelected: !item.isSelected } : item,
            );
            return {
                ...prev,
                deviceActions: {
                    ...prev.deviceActions,
                    [deviceType]: updatedActions,
                },
            };
        });
    }, []);

    const setAllActions = useCallback(<T extends DeviceType>(deviceType: T, selected: boolean) => {
        setState((prev) => {
            const currentActions = prev.deviceActions[deviceType];
            const updatedActions = currentActions.map((item) => ({ ...item, isSelected: selected }));
            return {
                ...prev,
                deviceActions: {
                    ...prev.deviceActions,
                    [deviceType]: updatedActions,
                },
            };
        });
    }, []);

    const setDeviceNote = useCallback(<T extends DeviceType>(deviceType: T, note: string) => {
        const trimmed = note.trim();
        if (!trimmed) return;
        setState((prev) => {
            const notes = prev.deviceNotes[deviceType] || [];
            return {
                ...prev,
                deviceNotes: {
                    ...prev.deviceNotes,
                    [deviceType]: [...notes, trimmed],
                },
            };
        });
    }, []);

    const deleteNote = useCallback(<T extends DeviceType>(deviceType: T, note: string) => {
        setState((prev) => {
            const notes = prev.deviceNotes[deviceType] || [];
            const updated = notes.filter((item) => item !== note);
            return {
                ...prev,
                deviceNotes: {
                    ...prev.deviceNotes,
                    [deviceType]: updated,
                },
            };
        });
    }, []);

    const setPhoto = useCallback((photo: Photo) => {
        setState((prev) => ({
            ...prev,
            photo,
        }));
    }, []);

    const clearPhoto = useCallback(() => {
        setState((prev) => ({
            ...prev,
            photo: null,
        }));
    }, []);

    return {
        state,
        maintenanceTypes,
        columnTypes,
        deviceTypes,
        setColumnType,
        setColumnNum,
        setArea,
        setDeviceNum,
        setDeviceId,
        setMaintenanceType,
        setDeviceType,
        toggleAction,
        setAllActions,
        setDeviceNote,
        deleteNote,
        setPhoto,
        clearPhoto,
    };
}