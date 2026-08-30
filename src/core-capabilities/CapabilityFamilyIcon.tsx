import React from 'react';

import {
  BarChart3,
  Bot,
  Code2,
  FileText,
  Map,
  Satellite,
} from 'lucide-react';

import type {
  CapabilityFamilyId,
} from './types';

type CapabilityFamilyIconProps = {
  familyId:
    CapabilityFamilyId;

  className?: string;
};

export default function CapabilityFamilyIcon({
  familyId,
  className,
}: CapabilityFamilyIconProps) {
  switch (familyId) {
    case 'spatial-analysis':
      return (
        <Map
          className={
            className
          }
          aria-hidden="true"
        />
      );

    case 'data-analytics':
      return (
        <BarChart3
          className={
            className
          }
          aria-hidden="true"
        />
      );

    case 'remote-sensing':
      return (
        <Satellite
          className={
            className
          }
          aria-hidden="true"
        />
      );

    case 'documentation':
      return (
        <FileText
          className={
            className
          }
          aria-hidden="true"
        />
      );

    case 'development':
      return (
        <Code2
          className={
            className
          }
          aria-hidden="true"
        />
      );

    case 'geoai-automation':
      return (
        <Bot
          className={
            className
          }
          aria-hidden="true"
        />
      );
  }
}