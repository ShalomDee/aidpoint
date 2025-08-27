import { render, screen } from '@testing-library/react';
import App from './App';

test('renders emergency resource finder', () => {
  render(<App />);
  const linkElement = screen.getByText(/Local Emergency Resource Finder/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(<App />);
  const homeButton = screen.getByText(/Home/i);
  const searchButton = screen.getByText(/Search/i);
  expect(homeButton).toBeInTheDocument();
  expect(searchButton).toBeInTheDocument();
});
