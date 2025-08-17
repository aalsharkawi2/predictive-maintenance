import { useState } from 'react';
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
    const [state, setState] = useState<MaintenanceState>({
        deviceId: '',
        selectedMaintenanceType: null,
        selectedDeviceType: null,
        deviceActions: {
            'سكينة': getDeviceActions('سكينة'),
            'محول': getDeviceActions('محول'),
            'لوحة': getDeviceActions('لوحة'),
        }
    });


    const setDeviceId = (id: string) => {
        setState(prev => ({ ...prev, deviceId: id }));
    };

    const setMaintenanceType = (type: MaintenanceType) => {
        setState(prev => ({ ...prev, selectedMaintenanceType: type }));
    };

    const setDeviceType = (type: DeviceType) => {
        setState(prev => ({ ...prev, selectedDeviceType: type }));
    };

    const toggleAction = <T extends DeviceType>(deviceType: T, actionIndex: number) => {
        setState(prev => {
            const deviceActionsCopy = { ...prev.deviceActions };
            if (!deviceActionsCopy[deviceType]) return prev;

            const updatedActions = [...deviceActionsCopy[deviceType]!];
            updatedActions[actionIndex] = {
                ...updatedActions[actionIndex],
                isSelected: !updatedActions[actionIndex].isSelected,
            };

            return {
                ...prev,
                deviceActions: {
                    ...deviceActionsCopy,
                    [deviceType]: updatedActions,
                },
            } as MaintenanceState;
        });
    };

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