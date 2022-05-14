// Write your tests here

import React from 'react';
import AppFunctional from './AppFunctional.js';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('sanity', () => {
  expect(true).toBe(true)
})

test('AppFunctional renders without crashing', () => {
  render(
      <AppFunctional />
        )
})

test('Header renders', () => {
  const wrapper = render(<AppFunctional />);

  const header = wrapper.queryByText(/Welcome to the GRID/i);
  expect(header).toBeInTheDocument;
});

test('Submit button renders', () => {
  const wrapper = render(<AppFunctional />);

  const submitButton = wrapper.queryByText(/submit query/i);
  expect(submitButton).toBeInTheDocument;
});

test('Starting coordinates are (2, 2)', () => {
  const wrapper = render(<AppFunctional />);

  const coordinates = wrapper.queryByText(/Coordinates (2, 2)/i);
  expect(coordinates).toBeInTheDocument;
})

test('Starting moves count is 0', () => {
  const wrapper = render(<AppFunctional />);

  const movesCount = wrapper.queryByText(/You moved 0 times/);
  expect(movesCount).toBeInTheDocument;
});

test('Typing in the email input field changes its value', () => {
  const wrapper = render(<AppFunctional />);

  const emailInputField = wrapper.queryByPlaceholderText(/type email/i);
  fireEvent.change(emailInputField, {target: {value: 'magallagher00@gmail.com'}});

  expect(emailInputField).toHaveValue('magallagher00@gmail.com');
});
