import { StaticSymbol, CompileProviderMetadata } from '@angular/compiler';
import { Theme } from './themes/color-map';

export interface Graph<T> {
  nodes: Node<T>[];
  edges: Edge[];
}

export enum SymbolTypes {
  Provider = 'provider',
  HtmlElement = 'html-element',
  HtmlElementWithDirective = 'html-element-with-directive',
  ComponentWithDirective = 'component-with-directive',
  Component = 'component',
  ComponentOrDirective = 'component-or-directive',
  Pipe = 'pipe',
  Module = 'module',
  LazyModule = 'lazy-module',
  Meta = 'meta',
  Unknown = 'unknown'
}

export interface SymbolType {
  angular: boolean;
  type: SymbolTypes;
}

export interface Node<T> {
  id: string;
  label: string;
  data?: T;
  type?: SymbolType;
}

export enum Direction {
  From,
  To,
  Both
}

export interface Edge {
  from: string;
  to: string;
  direction?: Direction;
  data?: any;
  dashes?: boolean;
}

export enum Layout {
  HierarchicalLRDirected,
  HierarchicalUDDirected,
  Regular
}

export interface Config {
  showLibs: boolean;
  showModules: boolean;
  theme: string;
  themes: { [key: string]: Theme };
}

export interface VisualizationConfig<T> {
  layout?: Layout;
  title: string;
  graph: Graph<T>;
}

export type StringPair = { key: string; value: string | null };

export interface Metadata {
  properties: { [key: number]: StringPair };
  filePath?: string | null;
}

export const getId = (symbol: { name: string; filePath: string }) => {
  return `${symbol.filePath}#${symbol.name}`;
};

export const getProviderId = (provider: CompileProviderMetadata) => {
  if (provider.token.value) {
    return provider.token.value;
  } else {
    if (provider.token.identifier) {
      return getId(provider.token.identifier.reference);
    }
    return null;
  }
};

export const getProviderName = (provider: CompileProviderMetadata) => {
  if (provider.token.value) {
    return provider.token.value;
  } else {
    if (provider.token.identifier) {
      return provider.token.identifier.reference.name;
    }
    return null;
  }
};

export const isAngularSymbol = (symbol: StaticSymbol | CompileProviderMetadata) => {
  if (symbol instanceof StaticSymbol) {
    return /node_modules\/@angular/.test(symbol.filePath);
  } else {
    if (!symbol || !symbol.token || symbol.token.value) {
      // We can't be completely sure since we don't know
      // the filePath but Angular doesn't have any non-reference tokens.
      return false;
    } else {
      if (symbol.token.identifier) {
        return isAngularSymbol(symbol.token.identifier.reference);
      }
      return null;
    }
  }
};
