import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, showIcon = true }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <span className="inline-flex items-center" ref={refs.setReference} {...getReferenceProps()}>
      {children}
      {showIcon && <HelpCircle className="h-4 w-4 ml-1 text-gray-400 hover:text-primary-400" />}
      <FloatingPortal>
        {isOpen && (
          <div
            className="z-50 max-w-xs bg-gray-900/95 text-white p-3 rounded-lg shadow-xl border border-gray-700/50 text-sm"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
          </div>
        )}
      </FloatingPortal>
    </span>
  );
};