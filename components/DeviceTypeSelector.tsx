import React from 'react';
import { TypeSelector } from '@/components/TypeSelector';
import { DeviceType } from '@/types/maintenance';

interface Props {
  options: DeviceType[];
  selected: DeviceType | null;
  onSelect: (t: DeviceType) => void;
}

export function DeviceTypeSelector({ options, selected, onSelect }: Props) {
  return (
    <TypeSelector
      title="نوع المكون"
      options={options}
      selectedOption={selected}
      onSelect={onSelect}
    />
  );
}
