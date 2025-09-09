import { useState, useCallback } from 'react';
import {
    MaintenanceType,
    ColumnType,
    DeviceType,
    DeviceActions,
    ActionItem,
    MaintenanceState
} from '@/types/maintenance';

export const maintenanceTypes: MaintenanceType[] = ['نهاية', 'جهاز'];
export const columnTypes: ColumnType[] = ['رعد', 'ع', 'ص'];
export const deviceTypes: DeviceType[] = ['سكينة', 'محول', 'لوحة'];

const rawDeviceActions: { [K in DeviceType]: DeviceActions<K>[] } = {
    'سكينة': [
        'مسح العوازل',
        'تشحيم السكينة',
        'تعديل اللوبات',
        'تغيير التشعيرات'
    ],
    'محول': [
        'تنظيف الجسم والعوازل وجهاز السليكاجيل',
        'التربيط على العوازل والجسم والكوس والمناولات',
        'عزل الفازات بشريط لحام'
    ],
    'لوحة': [
        'تنظيف اللوحة',
        'التربيط على الكوس والبارات',
        'عزل الفازات بشريط لحام',
        'تزويد فوم',
        'إزالة عش',
        'تغيير قواطع',
        'تغيير ورد ومسامير'
    ],
};

const deviceNotes: { [K in DeviceType]: string[] } = {
    'سكينة': [
    ],
    'محول': [
    ],
    'لوحة': [
    ],
};

function getDeviceActions<T extends DeviceType>(deviceType: T): ActionItem<T>[] {
    const actions = rawDeviceActions[deviceType];
    if (!actions) throw new Error(`Missing actions for device type: ${deviceType}`);
    return actions.map(action => ({
        action,
        isSelected: false,
    }));
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
            'سكينة': getDeviceActions('سكينة'),
            'محول': getDeviceActions('محول'),
            'لوحة': getDeviceActions('لوحة'),
        },
        deviceNotes,
    }));

    const setColumnType = useCallback((type: ColumnType) => {
        setState(prev => (prev.selectedColumnType === type ? prev : {
            ...prev, selectedColumnType: type, deviceId: '', columnNum: '', area: '', deviceNum: '', selectedDeviceType: 'لوحة', deviceActions: {
                'سكينة': getDeviceActions('سكينة'),
                'محول': getDeviceActions('محول'),
                'لوحة': getDeviceActions('لوحة'),
            }, deviceNotes: {
                'سكينة': [
                ],
                'محول': [
                ],
                'لوحة': [
                ],
            }
        }));
    }, []);

    const setColumnNum = useCallback((num: number | '') => {
        setState(prev => ({ ...prev, columnNum: num }));
    }, []);

    const setArea = useCallback((num: number | string) => {
        setState(prev => ({ ...prev, area: num }));
    }, []);

    const setDeviceNum = useCallback((num: number | '') => {
        setState(prev => ({ ...prev, deviceNum: num }));
    }, []);

    const setDeviceId = useCallback((id: string) => {
        setState(prev => (prev.deviceId === id ? prev : { ...prev, deviceId: id }));
    }, []);

    const setMaintenanceType = useCallback((type: MaintenanceType) => {
        setState(prev =>
            prev.selectedMaintenanceType === type ? prev : { ...prev, selectedMaintenanceType: type, deviceId: '', selectedColumnType: null }
        );
        state.selectedMaintenanceType === 'جهاز' ? setColumnType('ص') : undefined;
    }, []);

    const setDeviceType = useCallback((type: DeviceType) => {
        setState(prev =>
            prev.selectedDeviceType === type ? prev : { ...prev, selectedDeviceType: type }
        );
    }, []);

    const toggleAction = useCallback(<T extends DeviceType>(deviceType: T, actionIndex: number) => {
        setState(prev => {
            const currentActions = prev.deviceActions[deviceType];
            if (actionIndex < 0 || actionIndex >= currentActions.length) return prev;

            const updatedActions = currentActions.map((item, i) =>
                i === actionIndex ? { ...item, isSelected: !item.isSelected } : item
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

    const setDeviceNote = useCallback(<T extends DeviceType>(deviceType: T, note: string) => {
        setState(prev => {
            const Notes = prev.deviceNotes[deviceType];
            note.trim() ? Notes.push(note) : Notes;
            return {
                ...prev,
                deviceNotes: {
                    ...prev.deviceNotes, [deviceType]: Notes,
                },
            };
        });
    }, []);

    const deleteNote = useCallback(<T extends DeviceType>(deviceType: T, note: string) => {
        setState(prev => {
            const Notes = prev.deviceNotes[deviceType];
            const deletedNoteIndex = Notes.findIndex((item) => note === item)
            Notes.splice(deletedNoteIndex, 1);
            return {
                ...prev,
                deviceNotes: {
                    ...prev.deviceNotes, [deviceType]: Notes,
                },
            };
        });
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
        setDeviceNote,
        deleteNote,
    };
}