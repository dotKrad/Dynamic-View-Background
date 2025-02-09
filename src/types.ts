import { ActionConfig, LovelaceCardConfig } from 'custom-card-helpers';

// TODO Add your configuration elements here for type-checking
export interface DynamicViewBackgroundCardConfig extends LovelaceCardConfig {
  type: string;
  debug?: boolean;
  entity?: string;
}
