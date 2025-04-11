
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PatientCard } from '../PatientCard';

// Mock patient data for testing
const mockPatient = {
  id: 'test-123',
  name: 'John Doe',
  avatar: '/test-avatar.jpg',
  lastVisit: '2025-04-01',
  condition: 'Hypertension'
};

// Mock onClick handler
const mockOnClick = jest.fn();

describe('PatientCard Component', () => {
  beforeEach(() => {
    // Reset the mock function calls before each test
    mockOnClick.mockClear();
  });

  it('renders patient information correctly', () => {
    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);
    
    // Check that patient name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check that last visit date is displayed
    expect(screen.getByText('Last visit: 2025-04-01')).toBeInTheDocument();
    
    // Check that condition badge is displayed
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
  });

  it('renders avatar with fallback', () => {
    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);
    
    // Check that avatar fallback shows first letter of name when image fails
    const avatarFallback = screen.getByText('J');
    expect(avatarFallback).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);
    
    // Find the patient card container and click it
    const patientCard = screen.getByText('John Doe').closest('div');
    fireEvent.click(patientCard as HTMLElement);
    
    // Check that onClick was called with the patient
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockPatient);
  });

  it('applies hover styles when hovered', () => {
    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);
    
    // Find the patient card container
    const patientCard = screen.getByText('John Doe').closest('div');
    
    // Check if the hover class is applied
    expect(patientCard).toHaveClass('hover:bg-muted/50');
  });
});
