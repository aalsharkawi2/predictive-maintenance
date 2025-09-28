import React from 'react';
import { TypeSelector } from '@/components/TypeSelector';
import { MaintenanceType } from '@/types/maintenance';

interface Props {
  options: MaintenanceType[];
  selected: MaintenanceType | null;
  onSelect: (t: MaintenanceType) => void;
}

export function MaintenanceTypeSelector({
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <TypeSelector
      title="نوع الصيانة"
      options={options}
      selectedOption={selected}
      onSelect={onSelect}
    />
  );
}
