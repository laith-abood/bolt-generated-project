import { ReactNode } from 'react';

/**
 * Type declarations for @headlessui/react components
 * These extend the original types to provide better TypeScript support
 */
declare module '@headlessui/react' {
  /**
   * Transition component types
   */
  interface TransitionEvents {
    beforeEnter?: () => void;
    afterEnter?: () => void;
    beforeLeave?: () => void;
    afterLeave?: () => void;
  }

  interface TransitionRenderProps extends TransitionEvents {
    show: boolean;
    appear?: boolean;
    unmount?: boolean;
  }

  export interface TransitionRootProps {
    show?: boolean;
    appear?: boolean;
    as?: React.ElementType;
    children: ReactNode | ((props: TransitionRenderProps) => ReactNode);
  }

  export interface TransitionChildProps {
    as?: React.ElementType;
    appear?: boolean;
    show?: boolean;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    children: ReactNode | ((props: TransitionRenderProps) => ReactNode);
  }

  /**
   * Dialog component types
   */
  interface DialogRenderProps {
    open: boolean;
    close: () => void;
  }

  export interface DialogProps {
    as?: React.ElementType;
    static?: boolean;
    open?: boolean;
    onClose: (value: boolean) => void;
    children: ReactNode | ((props: DialogRenderProps) => ReactNode);
  }

  export interface DialogPanelProps {
    as?: React.ElementType;
    children: ReactNode | ((props: DialogRenderProps) => ReactNode);
  }

  /**
   * Menu component types
   */
  interface MenuRenderProps {
    open: boolean;
    close: () => void;
  }

  export interface MenuProps {
    as?: React.ElementType;
    children: ReactNode | ((props: MenuRenderProps) => ReactNode);
  }

  export interface MenuButtonProps {
    as?: React.ElementType;
    children: ReactNode | ((props: MenuRenderProps) => ReactNode);
  }

  interface MenuItemsRenderProps {
    open: boolean;
    close: () => void;
  }

  export interface MenuItemsProps {
    as?: React.ElementType;
    static?: boolean;
    children: ReactNode | ((props: MenuItemsRenderProps) => ReactNode);
  }

  interface MenuItemRenderProps {
    active: boolean;
    disabled: boolean;
    close: () => void;
  }

  export interface MenuItemProps {
    as?: React.ElementType;
    disabled?: boolean;
    children: ReactNode | ((props: MenuItemRenderProps) => ReactNode);
  }
}
