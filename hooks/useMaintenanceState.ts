import { useState, useCallback } from 'react';
import {
    MaintenanceType,
    DeviceType,
    DeviceActions,
    ActionItem,
    MaintenanceState
} from '@/types/maintenance';

const maintenanceTypes: MaintenanceType[] = ['نهاية', 'جهاز'];
const deviceTypes: DeviceType[] = ['سكينة', 'محول', 'لوحة'];

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
        deviceId: '',
        selectedMaintenanceType: null,
        selectedDeviceType: null,
        deviceActions: {
            'سكينة': getDeviceActions('سكينة'),
            'محول': getDeviceActions('محول'),
            'لوحة': getDeviceActions('لوحة'),
        },
    }));


    const setDeviceId = useCallback((id: string) => {
        setState(prev => (prev.deviceId === id ? prev : { ...prev, deviceId: id }));
    }, []);

    const setMaintenanceType = useCallback((type: MaintenanceType) => {
        setState(prev =>
            prev.selectedMaintenanceType === type ? prev : { ...prev, selectedMaintenanceType: type }
        );
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

    return {
        state,
        maintenanceTypes,
        deviceTypes,
        setDeviceId,
        setMaintenanceType,
        setDeviceType,
        toggleAction,
    };
}