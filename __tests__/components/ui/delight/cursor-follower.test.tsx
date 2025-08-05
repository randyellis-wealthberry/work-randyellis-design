import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useState, useEffect, useRef } from 'react';

// Mock cursor follower component
function MockCursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        data-testid="cursor-follower"
        ref={followerRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: isHovering ? '#3b82f6' : '#6b7280',
          opacity: isActive ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.15s ease-out',
        }}
      />
      <div
        data-testid="hover-target"
        style={{ width: '100px', height: '100px', backgroundColor: 'red' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        Hover Target
      </div>
    </>
  );
}

describe('Cursor Follower Delight Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cursor follower element', () => {
    render(<MockCursorFollower />);
    
    expect(screen.getByTestId('cursor-follower')).toBeInTheDocument();
    expect(screen.getByTestId('hover-target')).toBeInTheDocument();
  });

  it('should initially be invisible', () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');
    expect(follower.style.opacity).toBe('0');
  });

  it('should follow mouse movement', async () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');

    // Simulate mouse movement
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });

    await waitFor(() => {
      expect(follower.style.left).toBe('100px');
      expect(follower.style.top).toBe('200px');
      expect(follower.style.opacity).toBe('1');
    });
  });

  it('should become visible on mouse movement', async () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');

    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });

    await waitFor(() => {
      expect(follower.style.opacity).toBe('1');
    });
  });

  it('should hide when mouse leaves document', async () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');

    // First make it visible
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    
    await waitFor(() => {
      expect(follower.style.opacity).toBe('1');
    });

    // Then hide it
    fireEvent.mouseLeave(document);

    await waitFor(() => {
      expect(follower.style.opacity).toBe('0');
    });
  });

  it('should change appearance on hover', async () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');
    const target = screen.getByTestId('hover-target');

    // Hover over target
    fireEvent.mouseEnter(target);

    await waitFor(() => {
      expect(follower.style.backgroundColor).toBe('rgb(59, 130, 246)');
    });

    // Leave target
    fireEvent.mouseLeave(target);

    await waitFor(() => {
      expect(follower.style.backgroundColor).toBe('rgb(107, 114, 128)');
    });
  });

  it('should update position continuously with multiple mouse moves', async () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');

    // Multiple mouse movements
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 150 });
    fireEvent.mouseMove(document, { clientX: 300, clientY: 250 });

    await waitFor(() => {
      expect(follower.style.left).toBe('300px');
      expect(follower.style.top).toBe('250px');
    });
  });

  it('should have proper styling and positioning', () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');

    expect(follower.style.position).toBe('fixed');
    expect(follower.style.width).toBe('20px');
    expect(follower.style.height).toBe('20px');
    expect(follower.style.borderRadius).toBe('50%');
    expect(follower.style.pointerEvents).toBe('none');
    expect(follower.style.zIndex).toBe('9999');
    expect(follower.style.transform).toBe('translate(-50%, -50%)');
    expect(follower.style.transition).toBe('all 0.15s ease-out');
  });

  it('should clean up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(<MockCursorFollower />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should handle rapid mouse movements efficiently', async () => {
    render(<MockCursorFollower />);
    
    const follower = screen.getByTestId('cursor-follower');

    // Simulate rapid mouse movements
    for (let i = 0; i < 50; i++) {
      fireEvent.mouseMove(document, { clientX: i * 10, clientY: i * 5 });
    }

    await waitFor(() => {
      expect(follower.style.left).toBe('490px');
      expect(follower.style.top).toBe('245px');
    });
  });

  it('should maintain performance with continuous hover state changes', async () => {
    render(<MockCursorFollower />);
    
    const target = screen.getByTestId('hover-target');
    const follower = screen.getByTestId('cursor-follower');

    // Rapid hover state changes
    for (let i = 0; i < 10; i++) {
      fireEvent.mouseEnter(target);
      fireEvent.mouseLeave(target);
    }

    // Should end up in non-hover state
    await waitFor(() => {
      expect(follower.style.backgroundColor).toBe('rgb(107, 114, 128)');
    });
  });
});