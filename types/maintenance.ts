export type MaintenanceType = 'نهاية' | 'جهاز';
export type ColumnType = 'ص' | 'ع' | 'رعد';
export type DeviceType = 'سكينة' | 'محول' | 'لوحة';
export type DisconnectingSwitchAction =
    | 'مسح العوازل'
    | 'تشحيم السكينة'
    | 'تعديل اللوبات'
    | 'تغيير التشعيرات';
export type TransformerAction =
    | 'تنظيف الجسم والعوازل وجهاز السليكاجيل'
    | 'التربيط على العوازل والجسم والكوس والمناولات'
    | 'عزل الفازات بشريط لحام';
export type PanelAction =
    | 'تنظيف اللوحة'
    | 'التربيط على الكوس والبارات'
    | 'عزل الفازات بشريط لحام'
    | 'تزويد فوم'
    | 'إزالة عش'
    | 'تغيير قواطع'
    | 'تغيير ورد ومسامير';

export type DeviceActionsMap = {
    سكينة: DisconnectingSwitchAction;
    محول: TransformerAction;
    لوحة: PanelAction;
};

export type DeviceActions<T extends DeviceType> = DeviceActionsMap[T];

export interface ActionItem<T extends DeviceType> {
    action: DeviceActions<T>;
    isSelected: boolean;
}

export interface MaintenanceState {
    selectedColumnType: ColumnType | null;
    columnNum: number | '';
    area: number | string;
    deviceNum: number | '';
    deviceId: string;
    selectedMaintenanceType: MaintenanceType | null;
    selectedDeviceType: DeviceType | null;
    deviceActions: {
        [key in DeviceType]: ActionItem<key>[];
    }
}